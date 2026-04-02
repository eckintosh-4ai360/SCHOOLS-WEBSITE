import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const pageSchema = z.object({
  section: z.string().min(1),
  content: z.string(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageSlug = page.toUpperCase() as "ABOUT" | "ACADEMICS" | "ADMISSIONS";

  const sections = await prisma.pageContent.findMany({ where: { page: pageSlug } });
  return NextResponse.json(sections);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { page } = await params;
  const pageSlug = page.toUpperCase() as "ABOUT" | "ACADEMICS" | "ADMISSIONS";

  const body = await request.json();
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const content = await prisma.pageContent.upsert({
    where: { page_section: { page: pageSlug, section: parsed.data.section } },
    update: { content: parsed.data.content },
    create: { page: pageSlug, section: parsed.data.section, content: parsed.data.content },
  });

  return NextResponse.json(content);
}
