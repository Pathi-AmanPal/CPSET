import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ToastContainer from "@/components/ui/Toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { email } = admin!;

  return (
    <div className="min-h-screen flex bg-[#050814] text-slate-200 font-mono">
      <AdminSidebar adminEmail={email} />
      <main className="flex-1 overflow-y-auto bg-[#070A1A]">
        <div className="max-w-7xl mx-auto p-6 md:p-10">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
}
