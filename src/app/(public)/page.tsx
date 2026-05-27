import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, BookOpen, CalendarDays, Clock3, MapPin, Users, Award, Star, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Home | Eckintosh Academy",
  description: "Welcome to Eckintosh Academy â€” a leading K-12 institution committed to academic excellence, character, and community.",
};

async function getHomeData() {
  const [posts, events, gallery] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, createdAt: true },
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      take: 3,
      orderBy: { date: "asc" },
      select: { id: true, title: true, description: true, date: true, endDate: true, location: true, image: true },
    }),
    prisma.galleryImage.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, caption: true, category: true },
    }),
  ]);
  return { posts, events, gallery };
}

const stats = [
  { icon: Users, value: "1,200+", label: "Students Enrolled" },
  { icon: BookOpen, value: "80+", label: "Expert Teachers" },
  { icon: Award, value: "40+", label: "Years of Excellence" },
  { icon: Star, value: "95%", label: "University Acceptance" },
];

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

export default async function HomePage() {
  const { posts, events, gallery } = await getHomeData();

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden hero-gradient md:min-h-screen">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-28 md:px-6 md:py-32 lg:grid-cols-2 lg:gap-12">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-[#e8a020]" />
              Ranked #1 Regional School 2026
            </div>
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-white text-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
              Empowering <span className="text-[#e8a020]">Minds</span>,<br />Shaping Futures
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-blue-100 sm:text-xl">
              At Eckintosh Academy, we nurture curious, compassionate, and capable leaders ready to make a difference in the world.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link href="/admissions" className="btn-accent w-full px-8 py-4 text-base sm:w-auto">
                Apply for Admission
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/about" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white/50 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-white/10 sm:w-auto">
                Explore Our School
              </Link>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden h-48 bg-white/10 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl font-bold font-serif text-[#e8a020]">40+</div>
                  <div className="text-sm text-blue-200">Years of Excellence</div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden h-32 bg-[#e8a020]/20 backdrop-blur-sm border border-[#e8a020]/30 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold font-serif">1,200+</div>
                  <div className="text-sm text-blue-200">Happy Students</div>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden h-32 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold font-serif">95%</div>
                  <div className="text-sm text-blue-200">University Acceptance</div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden h-48 bg-[#e8a020]/20 backdrop-blur-sm border-2 border-[#e8a020]/30 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl font-bold font-serif">80+</div>
                  <div className="text-sm text-blue-200">Expert Educators</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-[#f8fafc]">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="card p-6 text-center group hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1a4f8a] transition-colors">
                  <Icon className="w-7 h-7 text-[#1a4f8a] group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl font-bold text-[#1a4f8a] font-serif">{value}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="section-padding bg-white">
        <div className="grid max-w-7xl mx-auto items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="section-label">Who We Are</p>
            <h2 className="section-title text-4xl md:text-5xl mb-6">A Legacy of Excellence Since 1985</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Founded on the belief that every child deserves world-class education, Greenfield Academy has grown into a leading institution serving over 1,200 students from Kindergarten through Grade 12.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Our expert educators, modern facilities, and holistic approach to learning ensure that every graduate leaves prepared for university, career, and life.
            </p>
            <Link href="/about" className="btn-outline">
              Learn More About Us <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { title: "Academic Excellence", desc: "Rigorous curriculum with AP and advanced courses", icon: "ðŸ“š" },
              { title: "Character Development", desc: "Building values, integrity, and social responsibility", icon: "ðŸ’Ž" },
              { title: "Modern Facilities", desc: "State-of-the-art labs, library, and sports complex", icon: "ðŸ«" },
              { title: "Community Focus", desc: "Strong parent-teacher partnerships and outreach", icon: "ðŸ¤" },
            ].map((item) => (
              <div key={item.title} className="card p-4 hover:-translate-y-1 transition-transform sm:p-5">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1a4f8a] mb-2 text-sm">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Latest Updates</p>
              <h2 className="section-title">News & Announcements</h2>
            </div>
            <Link href="/news" className="btn-ghost hidden md:flex">
              View All News <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No posts yet. Check back soon!</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="card-hover group">
                  <div className="h-48 bg-gradient-to-br from-[#1a4f8a] to-[#1e6fbf] flex items-center justify-center relative overflow-hidden">
                    {post.featuredImage ? (
                      <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <BookOpen className="w-12 h-12 text-white/40" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[#e8a020] font-semibold mb-2">
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <h3 className="font-bold text-[#0f3460] group-hover:text-[#1a4f8a] transition-colors mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="mt-4 flex items-center text-[#1a4f8a] text-sm font-medium group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6 text-center md:hidden">
            <Link href="/news" className="btn-outline text-sm">View All News</Link>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">What's Coming</p>
              <h2 className="section-title">Upcoming Events</h2>
            </div>
            <Link href="/events" className="btn-ghost hidden md:flex">
              View All Events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="card py-12 text-center text-slate-400">
              <CalendarDays className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              No upcoming events at the moment.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event, index) => {
                const start = new Date(event.date);
                const end = event.endDate ? new Date(event.endDate) : null;

                return (
                  <article
                    key={event.id}
                    className={`group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      index === 0 ? "md:col-span-2 md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] xl:col-span-2" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden bg-slate-950 ${index === 0 ? "min-h-[260px] md:min-h-full" : "h-56"}`}>
                      {event.image ? (
                        <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 hero-gradient" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/25 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-3 py-2 text-center shadow-lg">
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

                    <div className={`flex flex-col justify-between ${index === 0 ? "p-6 sm:p-8" : "p-5 sm:p-6"}`}>
                      <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1a4f8a]">
                            {index === 0 ? "Featured event" : "Upcoming"}
                          </span>
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {formatEventDateRange(start, end)}
                          </span>
                        </div>
                        <h3 className={`font-bold text-[#0f3460] transition-colors group-hover:text-[#1a4f8a] ${index === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                          {event.title}
                        </h3>
                        <p className={`mt-3 text-slate-600 ${index === 0 ? "line-clamp-4 text-base leading-7" : "line-clamp-3 text-sm leading-6"}`}>
                          {event.description}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                          <CalendarDays className="h-4 w-4 text-[#1a4f8a]" />
                          {formatEventDateRange(start, end)}
                        </div>
                        <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a4f8a] transition-transform group-hover:translate-x-1">
                          View event calendar
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="section-padding bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">In Pictures</p>
                <h2 className="section-title">Life at Greenfield</h2>
              </div>
              <Link href="/gallery" className="btn-ghost hidden md:flex">
                View Gallery <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3">
              {gallery.map((img, i) => (
                <div key={img.id} className={`relative overflow-hidden rounded-2xl ${i === 0 ? "row-span-2" : ""} group`} style={{ height: i === 0 ? "300px" : "145px" }}>
                  <Image src={img.url} alt={img.caption || "Gallery"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-medium">{img.caption || img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ADMISSIONS CTA */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#e8a020] font-semibold uppercase tracking-widest text-sm mb-4">Admissions 2024/2025</p>
          <h2 className="mb-6 font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Begin Your Child's Journey to Excellence
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-blue-100 md:text-xl">
            Join over 1,200 students who call Greenfield Academy home. Limited spaces available â€” apply today and secure your child's future.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link href="/admissions" className="btn-accent w-full px-10 py-4 text-base sm:w-auto">
              Start Application <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white/50 px-10 py-4 font-semibold text-white transition-all duration-200 hover:bg-white/10 sm:w-auto">
              Talk to Admissions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
