import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().nullable().optional(),
  photoPublicId: z.string().nullable().optional(),
  photoBase64: z.string().optional(),
  order: z.number().optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(staff);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.staff.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { photoBase64, photoUrl, photoPublicId, ...rest } = parsed.data;
  const updateData: Record<string, unknown> = { ...rest };

  if (photoBase64) {
    if (existing.photoPublicId) await deleteImage(existing.photoPublicId);
    const result = await uploadImage(photoBase64, "school-site/staff");
    updateData.photoUrl = result.url;
    updateData.photoPublicId = result.publicId;
  } else {
    const incomingPublicId = photoPublicId ?? existing.photoPublicId;
    const imageChanged = "photoPublicId" in parsed.data && incomingPublicId !== existing.photoPublicId;
    const imageRemoved = "photoUrl" in parsed.data && !photoUrl;

    if ((imageChanged || imageRemoved) && existing.photoPublicId) {
      await deleteImage(existing.photoPublicId);
    }

    if ("photoUrl" in parsed.data) updateData.photoUrl = photoUrl || null;
    if ("photoPublicId" in parsed.data) updateData.photoPublicId = photoPublicId || null;
  }

  const staff = await prisma.staff.update({ where: { id }, data: updateData });
  return NextResponse.json(staff);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (staff.photoPublicId) await deleteImage(staff.photoPublicId);
  await prisma.staff.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
