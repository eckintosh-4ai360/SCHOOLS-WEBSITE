"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onPublicIdChange?: (publicId: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({ value, onChange, onPublicIdChange, folder = "school-site", label = "Upload Image" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const base64 = await toBase64(file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, folder }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      if (onPublicIdChange) onPublicIdChange(data.publicId);
      toast.success("Image uploaded!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <p className="admin-label">{label}</p>
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-300 group">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => {
              onChange("");
              if (onPublicIdChange) onPublicIdChange("");
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1a4f8a] hover:bg-blue-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 group"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#1a4f8a] animate-spin" />
              <p className="text-sm text-slate-500">Uploading to Cloudinary...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-[#1a4f8a] flex items-center justify-center transition-colors">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">Click or drag & drop</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
