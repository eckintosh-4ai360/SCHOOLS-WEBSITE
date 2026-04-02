"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/dashboard/ImageUploader";

interface StaffFormProps {
  initialData?: {
    id: string;
    name: string;
    role: string;
    department: string | null;
    bio: string | null;
    photoUrl: string | null;
    order: number;
  };
  mode: "new" | "edit";
}

export default function StaffForm({ initialData, mode }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    department: initialData?.department || "",
    bio: initialData?.bio || "",
    photoUrl: initialData?.photoUrl || "",
    photoPublicId: "",
    order: initialData?.order || 0,
    photoBase64: "", // For new uploads
  });

  const set = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast.error("Name and role are required");
      return;
    }

    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/staff/${initialData!.id}` : "/api/staff";
      const method = mode === "edit" ? "PUT" : "POST";
      
      const payload = { ...form };
      if (!form.photoBase64) delete (payload as any).photoBase64;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save staff member");
      }

      toast.success(mode === "edit" ? "Staff updated!" : "Staff added!");
      router.push("/admin/staff");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/staff"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">
            {mode === "edit" ? "Edit Staff Member" : "Add Staff Member"}
          </h1>
        </div>
      </div>

      <form onSubmit={onSubmit} className="admin-card space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <ImageUploader
              value={form.photoUrl}
              onChange={(url) => set("photoUrl", url)}
              onPublicIdChange={(publicId) => set("photoPublicId", publicId)}
              folder="school-site/staff"
              label="Staff Photo"
            />
          </div>
          <div>
            <label className="admin-label">Full Name *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Dr. John Doe"
              className="admin-input"
              required
            />
          </div>
          <div>
            <label className="admin-label">Role *</label>
            <input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="e.g. Principal"
              className="admin-input"
              required
            />
          </div>
          <div>
            <label className="admin-label">Department</label>
            <input
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              placeholder="e.g. Science"
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => set("order", parseInt(e.target.value) || 0)}
              className="admin-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">Biography</label>
            <textarea
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={4}
              placeholder="Brief professional background..."
              className="admin-input resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />{" "}
              {mode === "edit" ? "Update Member" : "Add Member"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
