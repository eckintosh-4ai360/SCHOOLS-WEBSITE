"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard, FileText, Calendar, Image, Users, MessageSquare, Settings,
  GraduationCap, LogOut, ChevronLeft, ChevronRight, Menu
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/gallery", icon: Image, label: "Gallery" },
  { href: "/admin/staff", icon: Users, label: "Staff" },
  { href: "/admin/pages", icon: Settings, label: "Page Content" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => {
          setCollapsed(false);
          setMobileOpen((open) => !open);
        }}
        className="fixed left-4 top-4 z-[60] rounded-lg bg-[#0f3460] p-2 text-white shadow-lg transition-colors hover:bg-[#1a4f8a] lg:hidden"
        aria-label="Toggle admin navigation"
        aria-expanded={mobileOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close admin navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-svh w-72 flex-col bg-[#0f3460] text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-svh lg:translate-x-0 lg:shadow-none ${
          collapsed ? "lg:w-16" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e8a020] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm font-serif leading-tight">Eckintosh</p>
              <p className="text-xs text-blue-300">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full bg-[#e8a020] flex items-center justify-center mx-auto">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto hidden rounded-lg p-1 transition-colors hover:bg-white/10 lg:block"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <ul className="space-y-1 px-3">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
                  title={collapsed ? label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#e8a020]" : "group-hover:text-[#e8a020] transition-colors"}`} />
                  {!collapsed && <span className="text-sm font-medium">{label}</span>}
                  {isActive && !collapsed && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#e8a020]" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <Link href="/" target="_blank" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-colors mb-1 ${collapsed ? "justify-center" : ""}`} title={collapsed ? "View Site" : undefined}>
          <GraduationCap className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">View Public Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
      </aside>
    </>
  );
}
