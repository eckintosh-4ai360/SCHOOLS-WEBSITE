import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin, Calendar } from "lucide-react";
import DeleteEventButton from "@/components/dashboard/DeleteEventButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Events" };

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">Manage Events</h1>
          <p className="text-slate-500 text-sm mt-1">{events.length} total events</p>
        </div>
        <Link href="/admin/events/new" className="btn-primary w-full text-sm sm:w-auto">
          <Plus className="w-4 h-4" /> New Event
        </Link>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Event</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No events yet. <Link href="/admin/events/new" className="text-[#1a4f8a] underline">Create your first event</Link>.</td></tr>
              ) : (
                events.map((event) => {
                  const d = new Date(event.date);
                  const isPast = d < new Date();
                  return (
                    <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 truncate max-w-xs">{event.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{event.description}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="flex items-center gap-1 text-xs"><Calendar className="w-3 h-3" />{d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span className="text-xs text-slate-400">{d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-xs text-slate-600"><MapPin className="w-3 h-3" />{event.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isPast ? "bg-slate-100 text-slate-500" : "bg-green-50 text-green-700"}`}>
                          {isPast ? "Past" : "Upcoming"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/events/${event.id}/edit`} className="p-1.5 text-slate-400 hover:text-[#1a4f8a] hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteEventButton id={event.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
