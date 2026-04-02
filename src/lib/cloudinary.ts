import { v2 as cloudinary } from "cloudinary";

function normalizeEnvValue(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function getCloudinaryConfig() {
  const cloudinaryUrl = normalizeEnvValue(process.env.CLOUDINARY_URL);

  let cloudName = normalizeEnvValue(
    process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
  let apiKey = normalizeEnvValue(process.env.CLOUDINARY_API_KEY);
  let apiSecret = normalizeEnvValue(process.env.CLOUDINARY_API_SECRET);

  if (cloudinaryUrl) {
    try {
      const parsed = new URL(cloudinaryUrl);
      cloudName = normalizeEnvValue(parsed.hostname) || cloudName;
      apiKey = normalizeEnvValue(parsed.username) || apiKey;
      apiSecret = normalizeEnvValue(parsed.password) || apiSecret;
    } catch {
      throw new Error(
        "CLOUDINARY_URL is invalid. Use the format cloudinary://<api_key>:<api_secret>@<cloud_name>."
      );
    }
  }

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured correctly. Set CLOUDINARY_URL or set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, then restart the dev server."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

let isConfigured = false;

function ensureCloudinaryConfigured() {
  if (isConfigured) return getCloudinaryConfig();

  const config = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });
  isConfigured = true;
  return config;
}

export { cloudinary };

export async function uploadImage(
  file: string,
  folder: string = "school-site"
): Promise<{ url: string; publicId: string }> {
  const config = ensureCloudinaryConfigured();
  const formData = new FormData();
  formData.set("file", file);
  formData.set("folder", folder);

  const authToken = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authToken}`,
    },
    body: formData,
    cache: "no-store",
  });

  const raw = await response.text();
  let payload: unknown = null;

  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    payload = raw;
  }

  if (!response.ok) {
    const cloudinaryHeaderError = response.headers.get("x-cld-error");
    const payloadMessage =
      payload && typeof payload === "object" && payload !== null && "error" in payload
        ? (() => {
            const errorPayload = (payload as { error?: unknown }).error;
            if (errorPayload && typeof errorPayload === "object" && "message" in errorPayload) {
              return String((errorPayload as { message?: unknown }).message ?? "");
            }
            return "";
          })()
        : payload && typeof payload === "object" && payload !== null && "message" in payload
          ? String((payload as { message?: unknown }).message ?? "")
          : typeof payload === "string"
            ? payload
            : "";

    const detail = payloadMessage || cloudinaryHeaderError || `HTTP ${response.status}`;
    throw new Error(`Cloudinary upload failed (${response.status}): ${detail}`);
  }

  if (!payload || typeof payload !== "object" || !("secure_url" in payload) || !("public_id" in payload)) {
    throw new Error("Cloudinary upload returned an unexpected response.");
  }

  return {
    url: String((payload as { secure_url: unknown }).secure_url),
    publicId: String((payload as { public_id: unknown }).public_id),
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  ensureCloudinaryConfigured();
  await cloudinary.uploader.destroy(publicId);
}
