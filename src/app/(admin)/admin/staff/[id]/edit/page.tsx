import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StaffForm from "@/components/dashboard/StaffForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Staff Member" };

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.staff.findUnique({ where: { id } });
  if (!member) notFound();

  return <StaffForm mode="edit" initialData={member} />;
}
