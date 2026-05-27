import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admissions | Eckintosh Academy",
  description: "Apply to Eckintosh Academy. Learn about our admissions process, requirements, and how to get started.",
};

async function getAdmissionsContent() {
  const sections = await prisma.pageContent.findMany({ where: { page: "ADMISSIONS" } });
  return Object.fromEntries(sections.map((s) => [s.section, s.content]));
}

const steps = [
  { step: "01", title: "Submit Application", desc: "Complete our online application form with your child's personal and academic details." },
  { step: "02", title: "Submit Documents", desc: "Upload required academic records, birth certificate, and supporting documents." },
  { step: "03", title: "Assessment Day", desc: "Attend our assessment day for students applying to Grade 4 and above." },
  { step: "04", title: "Family Interview", desc: "A brief meeting with our admissions team to learn more about your family." },
  { step: "05", title: "Receive Decision", desc: "We will notify you of the admissions decision within 2 weeks." },
];

export default async function AdmissionsPage() {
  const content = await getAdmissionsContent();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient pb-16 pt-24 md:pt-28">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#e8a020] font-semibold uppercase tracking-widest text-sm mb-4">Join Our Community</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">Admissions 2024/2025</h1>
          <p className="mb-8 text-lg text-blue-100 md:text-xl">Applications are open. Take the first step towards an extraordinary education.</p>
          <Link href="/contact" className="btn-accent w-full px-10 py-4 text-base sm:w-auto">
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-[#f8fafc]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="section-label">Why Eckintosh?</p>
          <h2 className="section-title text-4xl mb-6">Start Your Child's Journey Here</h2>
          {content.overview ? (
            <div className="text-slate-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: content.overview }} />
          ) : (
            <p className="text-slate-600 text-lg">We welcome applications from families who share our commitment to academic excellence and character development.</p>
          )}
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="section-label">How to Apply</p>
            <h2 className="section-title text-4xl">Our Admissions Process</h2>
          </div>
          {content.process ? (
            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-[#1a4f8a]" dangerouslySetInnerHTML={{ __html: content.process }} />
          ) : (
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={s.step} className="group card flex flex-col gap-4 p-5 transition-transform hover:-translate-x-1 sm:flex-row sm:gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[#1a4f8a] text-white flex items-center justify-center font-bold text-sm font-serif">{s.step}</div>
                  <div>
                    <h3 className="font-bold text-[#0f3460] mb-1 group-hover:text-[#1a4f8a] transition-colors">{s.title}</h3>
                    <p className="text-slate-500 text-sm">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && <div className="absolute left-6 mt-16 w-0.5 h-6 bg-slate-200 hidden" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12">
          <div>
            <p className="section-label">What You Need</p>
            <h2 className="section-title text-4xl mb-6">Requirements & Documents</h2>
            {content.requirements ? (
              <div className="prose prose-lg prose-li:text-slate-600 prose-headings:text-[#1a4f8a]" dangerouslySetInnerHTML={{ __html: content.requirements }} />
            ) : (
              <ul className="space-y-3">
                {["Completed application form", "Copy of birth certificate", "Previous school reports (last 2 years)", "Passport-sized photographs (2)", "Immunisation records"].map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1a4f8a] shrink-0 mt-0.5" />
                    <span className="text-slate-600">{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-bold text-[#1a4f8a] text-xl mb-4 font-serif">Download Forms</h3>
              <div className="space-y-3">
                {["Application Form 2024/2025", "Medical Information Form", "Previous School Reference Form"].map((form) => (
                  <a key={form} href="#" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#1a4f8a] hover:bg-blue-50 transition-colors group">
                    <span className="text-sm text-slate-700 group-hover:text-[#1a4f8a]">{form}</span>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-[#1a4f8a]" />
                  </a>
                ))}
              </div>
            </div>
            <div className="card p-6 bg-[#1a4f8a] text-white">
              <h3 className="font-bold text-xl mb-3 font-serif">Need Help?</h3>
              <p className="text-blue-200 text-sm mb-4">Our admissions team is happy to answer your questions.</p>
              <div className="space-y-2">
                <a href={`tel:${process.env.NEXT_PUBLIC_SCHOOL_PHONE}`} className="flex items-center gap-2 text-sm hover:text-[#e8a020] transition-colors">
                  <Phone className="w-4 h-4" /> {process.env.NEXT_PUBLIC_SCHOOL_PHONE}
                </a>
                <a href={`mailto:${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}`} className="flex items-center gap-2 text-sm hover:text-[#e8a020] transition-colors">
                  <Mail className="w-4 h-4" /> {process.env.NEXT_PUBLIC_SCHOOL_EMAIL}
                </a>
              </div>
              <Link href="/contact" className="mt-4 btn-accent w-full text-sm">
                Contact Admissions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
