import AnalyticsClient from "@/components/Modules/Admin/AnalyticsClient";

export const metadata = {
  title: "Analytics | Censura Admin",
  description: "View sales, ratings, and content analytics.",
};

export default function AdminAnalyticsPage() {
  return <AnalyticsClient />;
}
