import Link from "next/link";
import { Settings, Info, GraduationCap, ArrowRight, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Pages Content" };

const pages = [
  {
    slug: "about",
    title: "About Page",
    description: "Edit history, mission, vision and values content.",
    icon: Info,
    color: "bg-blue-50 text-blue-600",
  },
  {
    slug: "academics",
    title: "Academics Page",
    description: "Edit academic overview and programme details.",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-600",
  },
  {
    slug: "admissions",
    title: "Admissions Page",
    description: "Edit admission process, requirements and info.",
    icon: FileText,
    color: "bg-amber-50 text-amber-600",
  },
];

export default function AdminPagesIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-serif">Manage Pages Content</h1>
        <p className="text-slate-500 text-sm mt-1">Select a page to edit its dynamic sections.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.slug}
              href={`/admin/pages/${p.slug}`}
              className="admin-card hover:shadow-md transition-shadow group flex flex-col"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{p.title}</h3>
              <p className="text-slate-500 text-sm flex-1 leading-relaxed">
                {p.description}
              </p>
              <div className="mt-6 flex items-center text-[#1a4f8a] text-sm font-medium group-hover:gap-2 transition-all">
                Edit Content <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="admin-card bg-blue-50 border-blue-100">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900">How it works</h4>
            <p className="text-sm text-blue-800 mt-1">
              Each page is divided into sections. Changing the content here will immediately update the respective public page. Use the rich text editor for formatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
