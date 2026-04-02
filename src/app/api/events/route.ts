import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string(),
  endDate: z.string().nullable().optional(),
  location: z.string().min(1),
  image: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const upcoming = searchParams.get("upcoming");

  const where = upcoming === "true" ? { date: { gte: new Date() } } : {};

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      image: parsed.data.image || null,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
