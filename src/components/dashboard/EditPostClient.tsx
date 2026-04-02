"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Loader2, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/dashboard/ImageUploader";

const TiptapEditor = dynamic(() => import("@/components/dashboard/TiptapEditor"), { ssr: false });

type Post = { id: string; title: string; slug: string; excerpt: string | null; content: string; featuredImage: string | null; published: boolean };

export default function EditPostClient({ post }: { post: Post }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    featuredImage: post.featuredImage || "",
    published: post.published,
  });
  const [content, setContent] = useState(post.content);

  const set = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, content }),
      });
      if (!res.ok) throw new Error("Failed to update post");
      toast.success("Post updated!");
      router.push("/admin/posts");
      router.refresh();
    } catch {
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/posts" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">Edit Post</h1>
          <p className="text-slate-500 text-sm mt-0.5 truncate max-w-sm">{post.title}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="admin-card space-y-4">
              <div>
                <label className="admin-label">Title</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} className="admin-input text-lg font-medium" required />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">/news/</span>
                  <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="admin-input flex-1" required />
                </div>
              </div>
              <div>
                <label className="admin-label">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} className="admin-input resize-none" />
              </div>
            </div>
            <div className="admin-card">
              <label className="admin-label mb-3 block">Content</label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>
          <div className="space-y-5">
            <div className="admin-card space-y-4">
              <h3 className="font-semibold text-slate-800">Publish Settings</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <p className="text-xs text-slate-400">{form.published ? "Visible on public site" : "Hidden from public"}</p>
                </div>
                <button type="button" onClick={() => set("published", !form.published)} className={`relative w-12 h-6 rounded-full transition-colors ${form.published ? "bg-[#1a4f8a]" : "bg-slate-300"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
            <div className="admin-card">
              <ImageUploader value={form.featuredImage} onChange={(url) => set("featuredImage", url)} folder="school-site/posts" label="Featured Image" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Update Post</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
