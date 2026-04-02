import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Eckintosh Academy News`,
    description: post.excerpt || post.title,
  };
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: { published: true, id: { not: post.id } },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, createdAt: true },
  });

  return (
    <>
      {/* Hero */}
      <div className="relative flex min-h-[320px] items-end bg-[#0f3460] pt-20 sm:min-h-[400px]">
        {post.featuredImage && (
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover opacity-30" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 pb-12 w-full">
          <Link href="/news" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-blue-200 text-sm">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author.name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {post.excerpt && (
          <p className="mb-8 border-l-4 border-[#e8a020] pl-4 text-lg italic leading-relaxed text-slate-600 sm:text-xl">{post.excerpt}</p>
        )}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#1a4f8a] prose-a:text-[#1a4f8a] prose-blockquote:border-[#e8a020] prose-li:text-slate-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/news" className="btn-outline">
            <ArrowLeft className="w-4 h-4" /> Back to All News
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold text-[#1a4f8a] font-serif mb-6">More News</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link key={p.id} href={`/news/${p.slug}`} className="card-hover group">
                  <div className="h-40 bg-gradient-to-br from-[#1a4f8a] to-[#1e6fbf] relative overflow-hidden">
                    {p.featuredImage && <Image src={p.featuredImage} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#e8a020] font-semibold mb-1">{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <h3 className="font-bold text-[#0f3460] group-hover:text-[#1a4f8a] line-clamp-2 transition-colors">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
