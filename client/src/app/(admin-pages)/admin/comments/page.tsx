import CommentClient from "@/components/Modules/Admin/Comments/CommentClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Comments | Censura",
  description: "Manage user comments and reviews",
};

export default function AdminCommentsPage() {
  return <CommentClient />;
}
