import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Eckintosh Academy",
  description: "Stay up to date with upcoming events, ceremonies, and activities at Eckintosh Academy.",
};

async function getEvents() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({ where: { date: { gte: now } }, orderBy: { date: "asc" } }),
    prisma.event.findMany({ where: { date: { lt: now } }, orderBy: { date: "desc" }, take: 6 }),
  ]);
  return { upcoming, past };
}

function formatEventDateRange(date: Date, endDate?: Date | null) {
  const startLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (!endDate) return startLabel;

  const endLabel = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
}

function formatEventTimeRange(date: Date, endDate?: Date | null) {
  const startLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (!endDate) return startLabel;

  const endLabel = endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${startLabel} - ${endLabel}`;
}

function EventCard({
  event,
  past = false,
}: {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    endDate: Date | null;
    location: string;
    image: string | null;
  };
  past?: boolean;
}) {
  const start = new Date(event.date);
  const end = event.endDate ? new Date(event.endDate) : null;

  return (
    <article className={`group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${past ? "opacity-80" : ""}`}>
      <div className="relative h-56 overflow-hidden bg-slate-950">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${past ? "grayscale-[0.15]" : ""}`}
          />
        ) : (
          <div className={`absolute inset-0 ${past ? "bg-gradient-to-br from-slate-400 to-slate-500" : "hero-gradient"}`} />
        )}
        {!event.image && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CalendarDays className="h-12 w-12 text-white/35" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/25 to-transparent" />
        <div className="absolute left-4 top-4">
          <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${past ? "bg-white/90 text-slate-500" : "bg-white/90 text-[#1a4f8a]"}`}>
            {past ? "Past event" : "Upcoming"}
          </span>
        </div>
        <div className="absolute right-4 top-4 rounded-2xl bg-white/95 px-3 py-2 text-center shadow-lg">
          <div className="font-serif text-2xl font-bold text-[#0f3460]">{start.getDate()}</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1a4f8a]">
            {start.toLocaleDateString("en-US", { month: "short" })}
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 text-xs text-white/90">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
            <Clock3 className="h-3.5 w-3.5" />
            {formatEventTimeRange(start, end)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${past ? "text-slate-400" : "text-[#1a4f8a]/70"}`}>
            {formatEventDateRange(start, end)}
          </p>
          <h3 className={`mt-2 text-xl font-bold transition-colors ${past ? "text-slate-500" : "text-[#0f3460] group-hover:text-[#1a4f8a]"}`}>
            {event.title}
          </h3>
        </div>

        <p className={`line-clamp-3 text-sm leading-6 ${past ? "text-slate-400" : "text-slate-600"}`}>{event.description}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">When</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <CalendarDays className="h-4 w-4 text-[#1a4f8a]" />
              {formatEventDateRange(start, end)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Where</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin className="h-4 w-4 text-[#1a4f8a]" />
              {event.location}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();

  return (
    <>
      <section className="relative overflow-hidden hero-gradient pb-16 pt-24 md:pt-28">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#e8a020]">Mark Your Calendar</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">Events & Activities</h1>
          <p className="text-lg text-blue-100 md:text-xl">Join us for exciting events, ceremonies, and community gatherings throughout the year.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-[#f8fafc]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <section className="section-padding bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-14">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-[#1a4f8a]" />
              <h2 className="font-serif text-2xl font-bold text-[#1a4f8a]">Upcoming Events</h2>
              {upcoming.length > 0 && (
                <span className="ml-auto rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-[#e8a020]">{upcoming.length} events</span>
              )}
            </div>

            {upcoming.length === 0 ? (
              <div className="card py-12 text-center">
                <CalendarDays className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                <p className="text-slate-400">No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="h-8 w-2 rounded-full bg-slate-300" />
                <h2 className="font-serif text-2xl font-bold text-slate-500">Past Events</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} past />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
