import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Users, Heart, Globe, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us |  Academy",
  description: "Learn about Greenfield Academy's history, mission, vision, and the dedicated staff who make our school exceptional.",
};

async function getAboutData() {
  const [sections, staff] = await Promise.all([
    prisma.pageContent.findMany({ where: { page: "ABOUT" } }),
    prisma.staff.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
  ]);
  const content = Object.fromEntries(sections.map((s) => [s.section, s.content]));
  return { content, staff };
}

const values = [
  { icon: "🎓", title: "Academic Rigor", desc: "High standards with personalized support for every learner" },
  { icon: "💡", title: "Innovation", desc: "Embracing technology and creative thinking in every classroom" },
  { icon: "🤝", title: "Community", desc: "A welcoming family of students, staff, and parents" },
  { icon: "🌍", title: "Global Perspective", desc: "Preparing students for an interconnected world" },
];

export default async function AboutPage() {
  const { content, staff } = await getAboutData();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient pb-16 pt-24 md:pt-28">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#e8a020] font-semibold uppercase tracking-widest text-sm mb-4">Our Story</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">About Greenfield Academy</h1>
          <p className="text-lg leading-relaxed text-blue-100 md:text-xl">Four decades of commitment to shaping tomorrow's leaders through excellence in education.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-[#f8fafc]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* History */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="grid max-w-7xl mx-auto items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="section-label">Our Beginning</p>
            <h2 className="section-title text-4xl mb-6">A Rich History of Impact</h2>
            {content.history ? (
              <div className="text-slate-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: content.history }} />
            ) : (
              <p className="text-slate-600">History content coming soon.</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
            {[
              { value: "1985", label: "Year Founded", color: "bg-[#1a4f8a]" },
              { value: "1,200+", label: "Students", color: "bg-[#e8a020]" },
              { value: "80+", label: "Faculty & Staff", color: "bg-[#0f3460]" },
              { value: "15 acres", label: "Campus Size", color: "bg-[#1e6fbf]" },
            ].map((item) => (
              <div key={item.label} className={`${item.color} text-white rounded-2xl p-6 text-center`}>
                <div className="text-3xl font-bold font-serif mb-1">{item.value}</div>
                <div className="text-sm opacity-80">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="section-label">Our Purpose</p>
            <h2 className="section-title text-4xl">Mission & Vision</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="card border-l-4 border-[#1a4f8a] p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#1a4f8a]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a4f8a] mb-4 font-serif">Our Mission</h3>
              {content.mission ? (
                <div className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.mission }} />
              ) : (
                <p className="text-slate-600">Mission statement coming soon.</p>
              )}
            </div>
            <div className="card border-l-4 border-[#e8a020] p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-[#e8a020]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f3460] mb-4 font-serif">Our Vision</h3>
              {content.vision ? (
                <div className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.vision }} />
              ) : (
                <p className="text-slate-600">Vision statement coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="section-label">What Drives Us</p>
          <h2 className="section-title text-4xl mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card-hover p-6 text-center group">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-[#1a4f8a] text-lg mb-2 group-hover:text-[#e8a020] transition-colors">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="section-label">Meet the Team</p>
            <h2 className="section-title text-4xl">Our Dedicated Staff</h2>
            <p className="section-subtitle mx-auto mt-4">Passionate educators committed to your child's success.</p>
          </div>
          {staff.length === 0 ? (
            <p className="text-center text-slate-400">Staff directory coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staff.map((member) => (
                <div key={member.id} className="card-hover text-center p-6 group">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-[#1a4f8a] to-[#1e6fbf] flex items-center justify-center relative">
                    {member.photoUrl ? (
                      <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-white font-serif">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#0f3460] group-hover:text-[#1a4f8a] transition-colors">{member.name}</h3>
                  <p className="text-[#e8a020] text-sm font-medium mt-1">{member.role}</p>
                  {member.department && <p className="text-slate-500 text-xs mt-1">{member.department}</p>}
                  {member.bio && <p className="text-slate-400 text-xs mt-3 line-clamp-2">{member.bio}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
