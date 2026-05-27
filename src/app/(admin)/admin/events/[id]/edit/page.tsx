import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EventForm from "@/components/dashboard/EventForm";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Edit Event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();
  return <EventForm mode="edit" initialData={{ ...event, date: event.date.toISOString(), endDate: event.endDate?.toISOString() }} />;
}
