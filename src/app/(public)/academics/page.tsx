import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { BookOpen, Beaker, Calculator, Globe, Music, Dumbbell } from "lucide-react";

export const metadata: Metadata = {
  title: "Academics | Eckintosh Academy",
  description: "Explore our comprehensive academic programs from Primary through High School, designed to challenge and inspire every learner.",
};

async function getAcademicsContent() {
  const sections = await prisma.pageContent.findMany({ where: { page: "ACADEMICS" } });
  return Object.fromEntries(sections.map((s) => [s.section, s.content]));
}

const departments = [
  { icon: BookOpen, name: "Languages & Literature", color: "bg-blue-50 text-blue-600", courses: ["English Language & Literature", "French", "Creative Writing", "Journalism"] },
  { icon: Beaker, name: "Science & Technology", color: "bg-green-50 text-green-600", courses: ["Biology", "Chemistry", "Physics", "Computer Science"] },
  { icon: Calculator, name: "Mathematics", color: "bg-purple-50 text-purple-600", courses: ["Algebra", "Calculus", "Statistics", "Applied Mathematics"] },
  { icon: Globe, name: "Social Studies", color: "bg-orange-50 text-orange-600", courses: ["History", "Geography", "Economics", "Civic Education"] },
  { icon: Music, name: "Arts & Culture", color: "bg-pink-50 text-pink-600", courses: ["Visual Arts", "Music", "Drama", "Cultural Studies"] },
  { icon: Dumbbell, name: "Physical Education", color: "bg-yellow-50 text-yellow-600", courses: ["Team Sports", "Athletics", "Health & Wellness", "Swimming"] },
];

export default async function AcademicsPage() {
  const content = await getAcademicsContent();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient pb-16 pt-24 md:pt-28">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#e8a020] font-semibold uppercase tracking-widest text-sm mb-4">Learning Without Limits</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">Academic Excellence</h1>
          <p className="text-lg leading-relaxed text-blue-100 md:text-xl">A comprehensive curriculum designed to ignite curiosity, build expertise, and prepare students for the future.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-[#f8fafc]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Overview */}
      {content.overview && (
        <section className="section-padding bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="section-label">Our Approach</p>
            <h2 className="section-title text-4xl mb-6">Why Our Curriculum Works</h2>
            <div className="text-slate-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: content.overview }} />
          </div>
        </section>
      )}

      {/* Programs */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="section-label">What We Offer</p>
            <h2 className="section-title text-4xl">Academic Programmes</h2>
          </div>
          {content.programs ? (
            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-[#1a4f8a] prose-li:text-slate-600" dangerouslySetInnerHTML={{ __html: content.programs }} />
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { level: "Primary School", grades: "K – Grade 6", icon: "🏫", desc: "A holistic foundation in literacy, numeracy, sciences, arts, and physical education." },
                { level: "Middle School", grades: "Grades 7 – 9", icon: "📚", desc: "Deep dives into core subjects with introduction to electives and extracurriculars." },
                { level: "High School", grades: "Grades 10 – 12", icon: "🎓", desc: "Advanced coursework, AP courses, and comprehensive university preparation." },
              ].map((p) => (
                <div key={p.level} className="card-hover p-8 text-center">
                  <div className="text-5xl mb-4">{p.icon}</div>
                  <h3 className="text-xl font-bold text-[#1a4f8a] mb-1 font-serif">{p.level}</h3>
                  <p className="text-[#e8a020] font-semibold text-sm mb-4">{p.grades}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Departments */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="section-label">Subjects & Disciplines</p>
            <h2 className="section-title text-4xl">Our Departments</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map(({ icon: Icon, name, color, courses }) => (
              <div key={name} className="card p-6 group hover:-translate-y-1 transition-transform">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#0f3460] text-lg mb-3 group-hover:text-[#1a4f8a] transition-colors">{name}</h3>
                <ul className="space-y-1">
                  {courses.map((c) => (
                    <li key={c} className="text-sm text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e8a020] shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra-curricular */}
      <section className="section-padding bg-white">
        <div className="grid max-w-7xl mx-auto items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="section-label">Beyond the Classroom</p>
            <h2 className="section-title text-4xl mb-6">Extra-Curricular Activities</h2>
            <p className="text-slate-600 leading-relaxed mb-6">We believe education extends beyond textbooks. Our students have access to over 30 clubs, sports teams, and community service programmes that build character, teamwork, and leadership.</p>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {["Debate Club", "Robotics Team", "Drama Club", "School Band", "Football", "Swimming", "Student Council", "Community Service"].map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#1a4f8a]" /> {a}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
            {["🏆 Regional Champions", "🎭 Drama Festival Winners", "🔬 Science Fair Gold", "🎵 Music Ensemble Award"].map((a) => (
              <div key={a} className="card p-5 text-center text-sm font-medium text-[#1a4f8a]">{a}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
