import ReviewsClient from "@/components/Modules/Admin/ReviewsClient";
export type TabStatus = "PENDING" | "APPROVED" | "UNPUBLISHED";

export const metadata = {
  title: "Review Moderation | Censura Admin",
  description: "Moderating user reviews.",
};

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status: string }>;
}) {
  const status = (await searchParams).status;

  return <ReviewsClient initialStatus={status as TabStatus} />;
}
