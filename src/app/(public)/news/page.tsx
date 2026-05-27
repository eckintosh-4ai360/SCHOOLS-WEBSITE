import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "News & Blog | Eckintosh Academy",
  description: "Stay up to date with the latest news, announcements, and stories from Eckintosh Academy.",
};

const PAGE_SIZE = 9;

async function getPosts(page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);
  return { posts, total, pages: Math.ceil(total / PAGE_SIZE) };
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const { posts, total, pages } = await getPosts(page);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient pb-16 pt-24 md:pt-28">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#e8a020] font-semibold uppercase tracking-widest text-sm mb-4">Stay Informed</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">News & Announcements</h1>
          <p className="text-lg text-blue-100 md:text-xl">The latest stories, achievements, and updates from our school community.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-[#f8fafc]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Posts */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No posts published yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-8">{total} {total === 1 ? "article" : "articles"} found</p>
              <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Link key={post.id} href={`/news/${post.slug}`} className={`card-hover group ${i === 0 && page === 1 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                    <div className="h-52 bg-gradient-to-br from-[#1a4f8a] to-[#1e6fbf] relative overflow-hidden">
                      {post.featuredImage ? (
                        <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-[#e8a020] font-semibold">
                          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <p className="text-xs text-slate-400">By {post.author.name}</p>
                      </div>
                      <h2 className="font-bold text-[#0f3460] group-hover:text-[#1a4f8a] transition-colors mb-2 line-clamp-2 text-lg">{post.title}</h2>
                      {post.excerpt && <p className="text-slate-500 text-sm line-clamp-3">{post.excerpt}</p>}
                      <div className="mt-4 flex items-center gap-1 text-[#1a4f8a] text-sm font-medium">
                        Read more <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {page > 1 && (
                    <Link href={`/news?page=${page - 1}`} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-white hover:text-[#1a4f8a] transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Link>
                  )}
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/news?page=${p}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-[#1a4f8a] text-white" : "border border-slate-300 text-slate-600 hover:bg-white hover:text-[#1a4f8a]"}`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < pages && (
                    <Link href={`/news?page=${page + 1}`} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-white hover:text-[#1a4f8a] transition-colors">
                      Next <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
