"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarDays, Clock3, Loader2, MapPin, Save } from "lucide-react";
import ImageUploader from "@/components/dashboard/ImageUploader";

interface EventFormProps {
  initialData?: {
    id: string; title: string; description: string;
    date: string; endDate?: string | null; location: string; image?: string | null;
  };
  mode: "new" | "edit";
}

function formatDateLabel(value: string) {
  if (!value) return "Choose a start date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Choose a start date";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatTimeRange(startValue: string, endValue: string) {
  if (!startValue) return "Add a time";
  const start = new Date(startValue);
  if (Number.isNaN(start.getTime())) return "Add a time";

  const startLabel = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (!endValue) return startLabel;

  const end = new Date(endValue);
  if (Number.isNaN(end.getTime())) return startLabel;
  return `${startLabel} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

export default function EventForm({ initialData, mode }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "",
    location: initialData?.location || "",
    image: initialData?.image || "",
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const previewDate = form.date ? new Date(form.date) : null;
  const hasPreviewDate = previewDate instanceof Date && !Number.isNaN(previewDate.getTime());
  const previewDay = hasPreviewDate ? previewDate.getDate().toString() : "--";
  const previewMonth = hasPreviewDate ? previewDate.toLocaleDateString("en-US", { month: "short" }) : "TBD";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) { toast.error("Title, date, and location are required"); return; }

    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/events/${initialData!.id}` : "/api/events";
      const method = mode === "edit" ? "PUT" : "POST";
      const payload = {
        ...form,
        endDate: form.endDate || null,
        image: form.image || null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(mode === "edit" ? "Event updated!" : "Event created!");
      router.push("/admin/events");
      router.refresh();
    } catch {
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} event`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/events" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">{mode === "edit" ? "Edit Event" : "Create New Event"}</h1>
          <p className="mt-1 text-sm text-slate-500">Build a polished public event card with schedule details, location, and an optional cover image.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          <div className="admin-card space-y-5">
            <div>
              <label className="admin-label">Event Title <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Event name..." className="admin-input" required />
            </div>
            <div>
              <label className="admin-label">Description <span className="text-red-500">*</span></label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                placeholder="Describe the event and highlight the experience families should expect..."
                className="admin-input resize-none"
                required
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="admin-label">Start Date & Time <span className="text-red-500">*</span></label>
                <input type="datetime-local" value={form.date} onChange={(e) => set("date", e.target.value)} className="admin-input" required />
              </div>
              <div>
                <label className="admin-label">End Date & Time <span className="text-slate-400">(optional)</span></label>
                <input type="datetime-local" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="admin-input" />
              </div>
            </div>
            <div>
              <label className="admin-label">Location <span className="text-red-500">*</span></label>
              <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. School Auditorium" className="admin-input" required />
            </div>
          </div>

          <div className="admin-card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Event Visual</h2>
              <p className="mt-1 text-sm text-slate-500">Add a cover image so upcoming events feel more engaging on the homepage and events page.</p>
            </div>
            <ImageUploader value={form.image} onChange={(url) => set("image", url)} folder="school-site/events" label="Cover Image" />
            <div>
              <label className="admin-label">Or paste an image URL</label>
              <input
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://example.com/event-cover.jpg"
                className="admin-input"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="relative h-56 overflow-hidden bg-slate-950">
              {form.image ? (
                <Image src={form.image} alt={form.title || "Event preview"} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 hero-gradient" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/25 to-transparent" />
              <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-3 py-2 text-center shadow-lg">
                <div className="font-serif text-2xl font-bold text-[#0f3460]">{previewDay}</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1a4f8a]">{previewMonth}</div>
              </div>
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 text-xs text-white/90">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatTimeRange(form.date, form.endDate)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                  <MapPin className="h-3.5 w-3.5" />
                  {form.location || "Event venue"}
                </span>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1a4f8a]/70">{formatDateLabel(form.date)}</p>
                <h2 className="mt-2 text-xl font-bold text-[#0f3460]">{form.title || "Your event title will appear here"}</h2>
              </div>
              <p className="line-clamp-4 text-sm leading-6 text-slate-600">
                {form.description || "Add a short, clear description so parents and students know why this event matters."}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Date</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-[#1a4f8a]" />
                    {formatDateLabel(form.date)}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Venue</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <MapPin className="h-4 w-4 text-[#1a4f8a]" />
                    {form.location || "Add a location"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {mode === "edit" ? "Update Event" : "Create Event"}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
