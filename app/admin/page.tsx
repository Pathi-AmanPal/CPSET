import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  redirect("/admin/dashboard");
}
