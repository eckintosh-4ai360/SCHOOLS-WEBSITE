import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

const uploadSchema = z.object({
  imageBase64: z.string(),
  folder: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const result = await uploadImage(parsed.data.imageBase64, parsed.data.folder || "school-site/uploads");
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Generic upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image upload failed" },
      { status: 500 }
    );
  }
}
