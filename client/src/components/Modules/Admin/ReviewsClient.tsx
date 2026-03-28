"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Star,
  Loader2,
  CheckCircle2,
  Clock,
  EyeOff,
  AlertTriangle,
  Filter,
} from "lucide-react";
import AdminReviewActionButtons from "@/components/Modules/Admin/AdminReviewActionButtons";
import { TabStatus } from "@/app/(admin-pages)/admin/reviews/page";
import { Review } from "@/types/media.types";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllReviews } from "@/services/admin.service";

const TABS: { label: string; value: TabStatus; icon: any; color: string }[] = [
  { label: "Pending", value: "PENDING", icon: Clock, color: "text-amber-500" },
  {
    label: "Approved",
    value: "APPROVED",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    label: "Unpublished",
    value: "UNPUBLISHED",
    icon: EyeOff,
    color: "text-red-500",
  },
];

export default function AdminReviewsPage({
  initialStatus,
}: {
  initialStatus: TabStatus;
}) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => adminGetAllReviews({ status: initialStatus }),
  });

  console.log("data from admin-review client: ", data);

  const [activeTab, setActiveTab] = useState<TabStatus>(initialStatus);
  const [reviews, setReviews] = useState<any[]>([]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setReviews((prev: any) => prev.filter((r: any) => r.id !== id));
  };

  const handleDelete = (id: string) => {
    setReviews((prev: any) => prev.filter((r: any) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve, unpublish, or remove user reviews.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.value
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon
              className={`size-3.5 ${activeTab === tab.value ? tab.color : ""}`}
            />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-border rounded-xl text-center">
          <MessageSquare className="size-10 text-muted-foreground" />
          <p className="font-medium">No {activeTab?.toLowerCase()} reviews</p>
          <p className="text-sm text-muted-foreground">
            {activeTab === "PENDING"
              ? "All reviews have been moderated. Great job!"
              : `No reviews with status "${activeTab?.toLowerCase()}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews?.map((review: any) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: User + Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* User row */}
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={review.user?.image} />
                      <AvatarFallback className="text-xs">
                        {review.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {review.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Star className="size-2.5 fill-amber-500 text-amber-500" />
                        {review.rating}/10
                      </Badge>
                      {review.hasSpoiler && (
                        <Badge className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                          <AlertTriangle className="size-2.5 mr-1" />
                          Spoiler
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Media info */}
                  {review.media && (
                    <p className="text-xs text-muted-foreground">
                      Reviewing:{" "}
                      <span className="font-medium text-foreground">
                        {review.media.title}
                      </span>{" "}
                      ({review.media.type})
                    </p>
                  )}

                  {/* Content */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {review.content}
                  </p>

                  {/* Tags */}
                  {review.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {review.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wide"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="shrink-0">
                  <AdminReviewActionButtons
                    reviewId={review.id}
                    currentStatus={activeTab}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
