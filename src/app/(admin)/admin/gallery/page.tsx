"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2, Loader2, Upload, Tag } from "lucide-react";

type GalleryImage = { id: string; url: string; publicId: string; caption: string | null; category: string; createdAt: string };

const CATEGORIES = ["General", "Sports", "Graduation", "Science", "Arts", "Events", "Campus"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [form, setForm] = useState({ caption: "", category: "General" });

  const fetchImages = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    setUploading(true);
    try {
      const base64 = await toBase64(file);
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          caption: form.caption,
          category: form.category,
          folder: `school-site/gallery/${form.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast.success("Image uploaded!");
      setForm({ caption: "", category: "General" });
      e.target.value = "";
      fetchImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image permanently?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setImages((imgs) => imgs.filter((i) => i.id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const filtered = filterCat === "All" ? images : images.filter((i) => i.category === filterCat);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-serif">Manage Gallery</h1>
        <p className="text-slate-500 text-sm mt-1">{images.length} total images</p>
      </div>

      {/* Upload Panel */}
      <div className="admin-card">
        <h2 className="font-semibold text-slate-800 mb-4">Upload New Image</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="admin-label">Caption <span className="text-slate-400">(optional)</span></label>
            <input value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} placeholder="Image caption..." className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="admin-input">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <label className={`btn-primary w-full justify-center cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose Image</>}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterCat === cat ? "bg-[#1a4f8a] text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-[#1a4f8a]"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-xl skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card text-center py-12 text-slate-400">No images in this category yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100">
              <Image src={img.url} alt={img.caption || img.category} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                <button onClick={() => handleDelete(img.id)} className="self-end w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div>
                  {img.caption && <p className="text-white text-xs font-medium truncate">{img.caption}</p>}
                  <span className="inline-flex items-center gap-1 mt-1 text-white/70 text-xs"><Tag className="w-3 h-3" />{img.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
