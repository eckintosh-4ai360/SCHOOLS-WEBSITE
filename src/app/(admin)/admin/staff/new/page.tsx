import StaffForm from "@/components/dashboard/StaffForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Staff Member" };

export default function NewStaffPage() {
  return <StaffForm mode="new" />;
}
