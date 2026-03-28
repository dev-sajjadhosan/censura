import AdminSidebar from "@/components/Modules/Admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset className="bg-background/95">
        <div className="p-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
