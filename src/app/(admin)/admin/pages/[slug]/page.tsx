"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Loader2, Save, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

const TiptapEditor = dynamic(
  () => import("@/components/dashboard/TiptapEditor"),
  { ssr: false }
);

const PAGE_SECTIONS: Record<string, { id: string; label: string }[]> = {
  about: [
    { id: "history", label: "School History" },
    { id: "mission", label: "Mission Statement" },
    { id: "vision", label: "Vision Statement" },
  ],
  academics: [
    { id: "overview", label: "Academic Overview" },
    { id: "programs", label: "Programmes Offered" },
  ],
  admissions: [
    { id: "overview", label: "Admissions Overview" },
    { id: "process", label: "Application Process" },
    { id: "requirements", label: "Requirements" },
  ],
};

export default function PageContentEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const sections = PAGE_SECTIONS[slug] || [];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slug || !sections.length) {
      if (slug) router.push("/admin/pages");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const map: Record<string, string> = {};
        data.forEach((s: any) => {
          map[s.section] = s.content;
        });
        setContentMap(map);
      } catch {
        toast.error("Failed to load page content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleSave = async (sectionId: string) => {
    const content = contentMap[sectionId] || "";
    setSaving(sectionId);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionId, content }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} updated`);
    } catch {
      toast.error(`Failed to save ${sectionId}`);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a4f8a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/pages"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif capitalize">
            Edit {slug} Page
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Modify the different sections of the {slug} page.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="admin-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-[#1a4f8a] font-serif">
                {section.label}
              </h3>
              <button
                onClick={() => handleSave(section.id)}
                disabled={saving === section.id}
                className="btn-primary text-xs px-4 py-2 disabled:opacity-60"
              >
                {saving === section.id ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" /> Save Section
                  </>
                )}
              </button>
            </div>
            <TiptapEditor
              content={contentMap[section.id] || ""}
              onChange={(html) =>
                setContentMap((prev) => ({ ...prev, [section.id]: html }))
              }
              placeholder={`Enter content for ${section.label}...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
