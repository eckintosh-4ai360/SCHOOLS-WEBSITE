import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostClient from "@/components/dashboard/EditPostClient";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return <EditPostClient post={post} />;
}
