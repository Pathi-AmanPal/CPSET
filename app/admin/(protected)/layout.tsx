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

  // After redirect() above, admin is guaranteed non-null here
  const { email } = admin!;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      <AdminSidebar adminEmail={email} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-8">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
}
