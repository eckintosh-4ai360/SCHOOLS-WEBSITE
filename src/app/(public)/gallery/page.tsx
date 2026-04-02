import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/public/GalleryGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Eckintosh Academy",
  description: "Browse photos from events, sports, graduation, and everyday life at Eckintosh Academy.",
};

async function getGallery() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } });
  const categories = [...new Set(images.map((i) => i.category))].filter(Boolean);
  return { images, categories };
}

export default async function GalleryPage() {
  const { images, categories } = await getGallery();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient pb-16 pt-24 md:pt-28">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#e8a020] font-semibold uppercase tracking-widest text-sm mb-4">In Pictures</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">Photo Gallery</h1>
          <p className="text-lg text-blue-100 md:text-xl">A glimpse into the vibrant life and achievements of our school community.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-[#f8fafc]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <GalleryGrid images={images} categories={categories} />
        </div>
      </section>
    </>
  );
}
