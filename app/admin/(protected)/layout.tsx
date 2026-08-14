import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ToastContainer from "@/components/ui/Toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      <AdminSidebar adminEmail={admin.email} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-8">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
}
