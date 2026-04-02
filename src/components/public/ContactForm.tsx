"use client";

import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type Field = { name: keyof z.infer<typeof schema>; label: string; type?: string; placeholder: string; required?: boolean };
const fields: Field[] = [
  { name: "name", label: "Full Name", placeholder: "Your name", required: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "your@email.com", required: true },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" },
  { name: "subject", label: "Subject", placeholder: "How can we help?", required: true },
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof typeof errors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        {fields.map((f) => (
          <div key={f.name} className={f.name === "subject" ? "sm:col-span-2" : ""}>
            <label htmlFor={f.name} className="admin-label">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type || "text"}
              value={form[f.name]}
              onChange={onChange}
              placeholder={f.placeholder}
              className={`admin-input ${errors[f.name] ? "border-red-400 focus:ring-red-400" : ""}`}
            />
            {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="message" className="admin-label">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={onChange}
          placeholder="Write your message here..."
          className={`admin-input resize-none ${errors.message ? "border-red-400 focus:ring-red-400" : ""}`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
      </button>
    </form>
  );
}
