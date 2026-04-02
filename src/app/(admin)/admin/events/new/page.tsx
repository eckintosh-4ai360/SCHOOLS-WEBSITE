import EventForm from "@/components/dashboard/EventForm";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "New Event" };
export default function NewEventPage() {
  return <EventForm mode="new" />;
}
