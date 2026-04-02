export const dynamic = "force-dynamic";
import UsersClient from "@/components/Modules/Admin/UsersClient";

export const metadata = {
  title: "User Management | Censura Admin",
  description: "Manage registered users, roles, and status.",
};

export default function AdminUsersPage() {
  return <UsersClient />;
}
