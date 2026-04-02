import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

const gallerySchema = z.object({
  imageBase64: z.string(),
  caption: z.string().optional(),
  category: z.string().default("General"),
  folder: z.string().optional(),
});

function toGalleryFolder(category: string) {
  const slug = category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `school-site/gallery/${slug}` : "school-site/gallery";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const images = await prisma.galleryImage.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const folder = parsed.data.folder || toGalleryFolder(parsed.data.category);
    const { url, publicId } = await uploadImage(parsed.data.imageBase64, folder);

    const image = await prisma.galleryImage.create({
      data: { url, publicId, caption: parsed.data.caption, category: parsed.data.category },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image upload failed" },
      { status: 500 }
    );
  }
}
