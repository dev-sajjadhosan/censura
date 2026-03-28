"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Film,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  ShoppingCart,
  Loader2,
  BarChart3,
  Eye,
  Award,
} from "lucide-react";
import {
  adminGetDashboardStats,
  adminGetSalesAnalytics,
  adminGetAllMedia,
  adminGetAllReviews,
} from "@/services/admin.service";
import StatsCard from "@/components/Modules/Admin/StatsCard";

export default function AnalyticsClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);
  const [topMedia, setTopMedia] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          adminGetDashboardStats(),
          adminGetSalesAnalytics(),
          adminGetAllMedia({
            limit: 10,
            sortBy: "avgRating",
            sortOrder: "desc",
          }),
          adminGetAllReviews({
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
          }),
        ]);

        if (results[0].status === "fulfilled")
          setStats((results[0].value as any)?.data);
        if (results[1].status === "fulfilled")
          setSalesData((results[1].value as any)?.data);
        if (results[2].status === "fulfilled")
          setTopMedia((results[2].value as any)?.data || []);
        if (results[3].status === "fulfilled")
          setRecentReviews((results[3].value as any)?.data?.recentReviews || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Revenue",
      value: salesData?.totalRevenue
        ? `$${Number(salesData.totalRevenue).toLocaleString()}`
        : stats?.totalRevenue
          ? `$${Number(stats.totalRevenue).toLocaleString()}`
          : "—",
      icon: DollarSign,
      variant: "default" as const,
    },
    {
      title: "Total Sales",
      value: salesData?.totalSales ?? stats?.totalSales ?? "—",
      icon: ShoppingCart,
      variant: "success" as const,
    },
    {
      title: "Rental Revenue",
      value: salesData?.rentalRevenue
        ? `$${Number(salesData.rentalRevenue).toLocaleString()}`
        : "—",
      icon: Film,
      variant: "info" as const,
    },
    {
      title: "Active Users",
      value: stats?.activeUsers ?? stats?.totalUsers ?? "—",
      icon: Users,
      variant: "success" as const,
    },
    {
      title: "Total Reviews",
      value: stats?.totalReviews ?? "—",
      icon: MessageSquare,
      variant: "warning" as const,
    },
    {
      title: "Avg. Rating",
      value:
        stats?.avgRating !== undefined
          ? Number(stats.avgRating).toFixed(1)
          : "—",
      icon: Star,
      variant: "default" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sales, ratings, and content performance overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards?.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Rated Titles */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <Award className="size-4 text-amber-500" />
            <h2 className="font-semibold text-sm">Highest Rated Titles</h2>
          </div>
          {topMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Film className="size-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">No data available</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {topMedia.slice(0, 8).map((item: any, idx: number) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xs font-mono text-muted-foreground w-5 text-right shrink-0">
                    {idx + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.releaseYear}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="size-3" />
                      {item.reviewCount || 0}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md">
                      <Star className="size-3 fill-amber-500" />
                      <span className="text-xs font-medium">
                        {item.avgRating?.toFixed(1) || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Reviews Activity */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <MessageSquare className="size-4 text-blue-500" />
            <h2 className="font-semibold text-sm">Recent Review Activity</h2>
          </div>
          {recentReviews?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="size-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">No reviews yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {Array.isArray(recentReviews) && recentReviews.slice(0, 8).map((review: any) => (
                <div
                  key={review.id}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {review.user?.name || "Unknown"}
                      </p>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Star className="size-2.5 fill-amber-500 text-amber-500" />
                        {review.rating}/10
                      </Badge>
                    </div>
                    {review.media && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        on{" "}
                        <span className="text-foreground font-medium">
                          {review.media.title}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {review.content}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Badge
                      className={`text-xs ${
                        review.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : review.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {review.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Revenue Breakdown Visual */}
      {salesData && (
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            <h2 className="font-semibold text-sm">Revenue Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Purchases",
                value: salesData.purchaseRevenue || 0,
                color: "bg-emerald-500",
              },
              {
                label: "Rentals",
                value: salesData.rentalRevenue || 0,
                color: "bg-blue-500",
              },
              {
                label: "Subscriptions",
                value: salesData.subscriptionRevenue || 0,
                color: "bg-purple-500",
              },
            ].map((item) => {
              const total =
                (salesData.purchaseRevenue || 0) +
                (salesData.rentalRevenue || 0) +
                (salesData.subscriptionRevenue || 0);
              const pct =
                total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div
                  key={item.label}
                  className="bg-muted/50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold">
                      ${Number(item.value).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
