import { getSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/dashboard/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | Admin — ECKINTOSH Academy", default: "Admin Dashboard" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname");
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-svh bg-slate-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 pl-16 shadow-sm sm:px-6 sm:pl-20 lg:pl-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">Admin Panel</p>
            <p className="hidden text-xs text-slate-500 sm:block">Manage content, updates, and school records</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">{session.name}</p>
              <p className="text-xs text-slate-500">{session.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1a4f8a] flex items-center justify-center text-white font-bold text-sm">
              {session.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
