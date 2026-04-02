"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

type GalleryItem = { id: string; url: string; caption?: string | null; category: string };

export default function GalleryGrid({ images, categories }: { images: GalleryItem[]; categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? images : images.filter((i) => i.category === activeCategory);

  const openModal = (idx: number) => setModalIndex(idx);
  const closeModal = () => setModalIndex(null);
  const prev = () => setModalIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () => setModalIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered.length]);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-[#1a4f8a] text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-[#1a4f8a] hover:text-[#1a4f8a]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No images in this category yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => openModal(idx)}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-zoom-in bg-slate-100"
            >
              <Image src={img.url} alt={img.caption || img.category} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-medium truncate">{img.caption || img.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in"
          onClick={closeModal}
        >
          <button
            className="absolute right-3 top-3 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
            onClick={closeModal}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>

          <div
            className="relative mx-12 w-full max-w-5xl sm:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[62svh] w-full sm:h-[70vh] md:h-[80vh]">
              <Image
                src={filtered[modalIndex].url}
                alt={filtered[modalIndex].caption || filtered[modalIndex].category}
                fill
                className="object-contain"
              />
            </div>
            {filtered[modalIndex].caption && (
              <p className="text-center text-white/80 text-sm mt-3">{filtered[modalIndex].caption}</p>
            )}
            <p className="text-center text-white/50 text-xs mt-1">{modalIndex + 1} / {filtered.length}</p>
          </div>

          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
          >
            <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        </div>
      )}
    </>
  );
}
