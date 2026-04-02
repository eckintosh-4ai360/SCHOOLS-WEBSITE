"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Trash2,
  Loader2,
  Mail,
  Phone,
  ArrowLeft,
  Clock,
} from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
      if (selected?.id === id) setSelected((s) => (s ? { ...s, read: true } : s));
    } catch {
      // Slient fail
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Delete this message permanently?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(null);
    }
  };

  const selectMessage = (m: Message) => {
    setSelected(m);
    if (!m.read) handleMarkAsRead(m.id);
  };

  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col gap-4 lg:h-[calc(100svh-8rem)] lg:flex-row lg:gap-6">
      {/* List */}
      <div
        className={`admin-card min-h-[320px] overflow-hidden p-0 ${
          selected ? "hidden lg:flex lg:w-[340px] lg:shrink-0 xl:w-[380px]" : "flex flex-col"
        }`}
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Inbox</h2>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {messages.filter((m) => !m.read).length} Unread
          </span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-hide">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-[#1a4f8a] animate-spin mx-auto" />
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No messages yet.</p>
            </div>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => selectMessage(m)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors relative group ${
                  selected?.id === m.id ? "bg-blue-50/50" : ""
                }`}
              >
                {!m.read && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full" />
                )}
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-bold truncate pr-2 ${m.read ? "text-slate-500" : "text-slate-800"}`}>
                    {m.name}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 uppercase tracking-tighter">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className={`text-xs truncate ${m.read ? "text-slate-400" : "text-slate-600"}`}>
                  {m.subject}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                  {m.message}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Reader */}
      <div
        className={`admin-card min-h-[360px] overflow-hidden p-0 ${
          selected ? "flex flex-1 flex-col" : "hidden lg:flex lg:flex-1 lg:flex-col"
        }`}
      >
        {selected ? (
          <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <button
                    onClick={() => setSelected(null)}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#1a4f8a] lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to inbox
                  </button>
                  <h2 className="text-xl font-bold text-slate-800 font-serif mb-4">
                    {selected.subject}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1a4f8a] flex items-center justify-center text-white text-xs font-bold">
                        {selected.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate font-semibold text-slate-800">{selected.name}</span>
                        <span className="block truncate text-slate-400">&lt;{selected.email}&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="border-b border-slate-100 bg-slate-50/30 px-4 py-4 text-xs text-slate-500 sm:px-6">
              <div className="flex flex-wrap gap-3 sm:gap-4">
              {selected.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {selected.phone}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {selected.email}
              </div>
                <div className="flex w-full items-center gap-1.5 sm:ml-auto sm:w-auto">
                <Clock className="w-3.5 h-3.5" /> {new Date(selected.createdAt).toLocaleString()}
              </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto whitespace-pre-wrap p-5 font-sans leading-relaxed text-slate-700 sm:p-8">
              {selected.message}
            </div>

            {/* Footer / Reply Action */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="btn-primary w-full sm:w-auto"
              >
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-medium">Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
