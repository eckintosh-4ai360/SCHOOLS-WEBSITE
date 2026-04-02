import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import DeleteStaffButton from "@/components/dashboard/DeleteStaffButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Staff" };

export default async function AdminStaffPage() {
  const staff = await prisma.staff.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">Manage Staff</h1>
          <p className="text-slate-500 text-sm mt-1">{staff.length} staff members</p>
        </div>
        <Link href="/admin/staff/new" className="btn-primary w-full text-sm sm:w-auto">
          <Plus className="w-4 h-4" /> Add Staff
        </Link>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Member</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No staff yet. <Link href="/admin/staff/new" className="text-[#1a4f8a] underline">Add your first member</Link>.</td></tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a4f8a] to-[#1e6fbf] flex items-center justify-center text-white font-bold text-sm overflow-hidden relative shrink-0">
                          {member.photoUrl
                            ? <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
                            : <span>{member.name.charAt(0)}</span>}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{member.name}</p>
                          {member.bio && <p className="text-xs text-slate-400 truncate max-w-xs">{member.bio}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{member.role}</td>
                    <td className="px-6 py-4 text-slate-500">{member.department || "—"}</td>
                    <td className="px-6 py-4 text-slate-500">{member.order}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/staff/${member.id}/edit`} className="p-1.5 text-slate-400 hover:text-[#1a4f8a] hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteStaffButton id={member.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
