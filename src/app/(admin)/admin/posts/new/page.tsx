"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Loader2, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/dashboard/ImageUploader";

const TiptapEditor = dynamic(() => import("@/components/dashboard/TiptapEditor"), { ssr: false });

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", featuredImage: "", published: false });
  const [content, setContent] = useState("");

  const set = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set("title", e.target.value);
    set("slug", slugify(e.target.value));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) { toast.error("Title and slug are required"); return; }
    if (!content || content === "<p></p>") { toast.error("Post content cannot be empty"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      toast.success("Post created successfully!");
      router.push("/admin/posts");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-serif">Create New Post</h1>
            <p className="text-slate-500 text-sm mt-0.5">Write and publish a news article or blog post</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="admin-card space-y-4">
              <div>
                <label className="admin-label">Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={onTitleChange} placeholder="Post title..." className="admin-input text-lg font-medium" required />
              </div>
              <div>
                <label className="admin-label">Slug <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">/news/</span>
                  <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="post-slug" className="admin-input flex-1" required />
                </div>
              </div>
              <div>
                <label className="admin-label">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} placeholder="Brief summary of the post..." className="admin-input resize-none" />
              </div>
            </div>

            <div className="admin-card">
              <label className="admin-label mb-3 block">Content <span className="text-red-500">*</span></label>
              <TiptapEditor content={content} onChange={setContent} placeholder="Write your post content here..." />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="admin-card space-y-4">
              <h3 className="font-semibold text-slate-800">Publish Settings</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <p className="text-xs text-slate-400">{form.published ? "Visible on public site" : "Hidden from public"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => set("published", !form.published)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.published ? "bg-[#1a4f8a]" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>
              <div className={`text-xs font-medium flex items-center gap-1 ${form.published ? "text-green-600" : "text-amber-600"}`}>
                {form.published ? <><Eye className="w-3 h-3" /> Will be published</> : <><EyeOff className="w-3 h-3" /> Saved as draft</>}
              </div>
            </div>

            <div className="admin-card">
              <ImageUploader value={form.featuredImage} onChange={(url) => set("featuredImage", url)} folder="school-site/posts" label="Featured Image" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Post</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
