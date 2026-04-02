import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [posts, events, gallery, messages, unreadMessages, staff] = await Promise.all([
    prisma.post.count(),
    prisma.event.count(),
    prisma.galleryImage.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.staff.count(),
  ]);

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, published: true, createdAt: true },
  });

  const recentMessages = await prisma.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, subject: true, read: true, createdAt: true },
  });

  return NextResponse.json({
    stats: { posts, events, gallery, messages, unreadMessages, staff },
    recentPosts,
    recentMessages,
  });
}
