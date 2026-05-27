import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Calendar, Image, MessageSquare, Users, TrendingUp, Plus, Eye, Mail } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardData() {
  const [posts, events, gallery, messages, unread, staff, recentPosts, recentMessages] = await Promise.all([
    prisma.post.count(),
    prisma.event.count(),
    prisma.galleryImage.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.staff.count(),
    prisma.post.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, title: true, published: true, createdAt: true } }),
    prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, subject: true, read: true, createdAt: true } }),
  ]);
  return { stats: { posts, events, gallery, messages, unread, staff }, recentPosts, recentMessages };
}

export default async function DashboardPage() {
  const { stats, recentPosts, recentMessages } = await getDashboardData();

  const statCards = [
    { icon: FileText, label: "Total Posts", value: stats.posts, color: "text-blue-600 bg-blue-50", href: "/admin/posts" },
    { icon: Calendar, label: "Total Events", value: stats.events, color: "text-purple-600 bg-purple-50", href: "/admin/events" },
    { icon: Image, label: "Gallery Images", value: stats.gallery, color: "text-green-600 bg-green-50", href: "/admin/gallery" },
    { icon: Users, label: "Staff Members", value: stats.staff, color: "text-orange-600 bg-orange-50", href: "/admin/staff" },
    { icon: MessageSquare, label: "Total Messages", value: stats.messages, color: "text-pink-600 bg-pink-50", href: "/admin/messages" },
    { icon: Mail, label: "Unread Messages", value: stats.unread, color: "text-red-600 bg-red-50", href: "/admin/messages" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary w-full text-sm sm:w-auto">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, href }) => (
          <Link key={label} href={href} className="admin-card hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800 font-serif">{value}</div>
            <div className="text-xs text-slate-500 mt-1 leading-tight">{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-[#1a4f8a] hover:underline">View all</Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No posts yet</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{p.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${p.published ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/posts/new" className="mt-4 btn-outline w-full text-sm">
            <Plus className="w-4 h-4 inline mr-1" /> Create New Post
          </Link>
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-[#1a4f8a] hover:underline">View all</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <Link key={m.id} href="/admin/messages" className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${m.read ? "text-slate-500" : "text-slate-800"}`}>{m.name} — {m.subject}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { href: "/admin/posts/new", icon: FileText, label: "New Post", color: "text-blue-600" },
            { href: "/admin/events", icon: Calendar, label: "New Event", color: "text-purple-600" },
            { href: "/admin/gallery", icon: Image, label: "Upload Photo", color: "text-green-600" },
            { href: "/admin/staff", icon: Users, label: "Add Staff", color: "text-orange-600" },
            { href: "/admin/pages", icon: TrendingUp, label: "Edit Pages", color: "text-pink-600" },
            { href: "/admin/messages", icon: MessageSquare, label: "View Messages", color: "text-red-600" },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link key={href} href={href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-[#1a4f8a] hover:bg-blue-50 transition-all group text-center">
              <Icon className={`w-6 h-6 ${color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-medium text-slate-600 group-hover:text-[#1a4f8a]">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
