import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

const staffSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  photoPublicId: z.string().optional(),
  photoBase64: z.string().optional(),
  order: z.number().default(0),
});

export async function GET() {
  const staff = await prisma.staff.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return NextResponse.json(staff);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = staffSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  let photoUrl: string | undefined;
  let photoPublicId: string | undefined;

  if (parsed.data.photoBase64) {
    const result = await uploadImage(parsed.data.photoBase64, "school-site/staff");
    photoUrl = result.url;
    photoPublicId = result.publicId;
  } else {
    photoUrl = parsed.data.photoUrl;
    photoPublicId = parsed.data.photoPublicId;
  }

  const { photoBase64, photoUrl: _photoUrl, photoPublicId: _photoPublicId, ...rest } = parsed.data;
  const staff = await prisma.staff.create({
    data: { ...rest, photoUrl, photoPublicId },
  });

  return NextResponse.json(staff, { status: 201 });
}
