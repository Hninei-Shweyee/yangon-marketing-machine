import type { Metadata } from "next";
import { AdminDashboard } from "@/components/sections/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Private dashboard for Yangon Marketing Machine audit requests."
};

export default function AdminPage() {
  return (
    <section className="min-h-screen bg-cloud">
      <div className="py-14">
        <AdminDashboard />
      </div>
    </section>
  );
}
