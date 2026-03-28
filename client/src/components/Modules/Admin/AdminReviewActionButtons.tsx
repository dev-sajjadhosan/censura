"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminUpdateReviewStatus,
  adminDeleteReview,
} from "@/services/admin.service";

interface Props {
  reviewId: string;
  currentStatus?: string;
  compact?: boolean;
  onStatusChange?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
}

export default function AdminReviewActionButtons({
  reviewId,
  currentStatus,
  compact = false,
  onStatusChange,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (
    status: "APPROVED" | "UNPUBLISHED" | "PENDING",
  ) => {
    try {
      setLoading(status);
      await adminUpdateReviewStatus(reviewId, status);
      toast.success(
        `Review ${status === "APPROVED" ? "approved" : status === "UNPUBLISHED" ? "unpublished" : "set to pending"}`,
      );
      onStatusChange?.(reviewId, status);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update review status");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      setLoading("DELETE");
      await adminDeleteReview(reviewId);
      toast.success("Review deleted");
      onDelete?.(reviewId);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete review");
    } finally {
      setLoading(null);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10"
          disabled={loading !== null}
          onClick={(e) => {
            e.preventDefault();
            handleStatusChange("APPROVED");
          }}
          title="Approve"
        >
          <Check className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-amber-500 hover:bg-amber-500/10"
          disabled={loading !== null}
          onClick={(e) => {
            e.preventDefault();
            handleStatusChange("UNPUBLISHED");
          }}
          title="Unpublish"
        >
          <X className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:bg-red-500/10"
          disabled={loading !== null}
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          title="Delete"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus !== "APPROVED" && (
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
          disabled={loading !== null}
          onClick={() => handleStatusChange("APPROVED")}
        >
          {loading === "APPROVED" ? "Approving…" : "Approve"}
        </Button>
      )}
      {currentStatus !== "UNPUBLISHED" && (
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
          disabled={loading !== null}
          onClick={() => handleStatusChange("UNPUBLISHED")}
        >
          {loading === "UNPUBLISHED" ? "…" : "Unpublish"}
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="text-red-500 hover:bg-red-500/10 text-xs"
        disabled={loading !== null}
        onClick={handleDelete}
      >
        <Trash2 className="size-3 mr-1" />
        {loading === "DELETE" ? "…" : "Delete"}
      </Button>
    </div>
  );
}
