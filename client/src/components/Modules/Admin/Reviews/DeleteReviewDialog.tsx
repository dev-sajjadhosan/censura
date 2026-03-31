"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Review } from "@/types/media.types";
import { adminDeleteReview } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteReviewDialogProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteReviewDialog({
  review,
  open,
  onOpenChange,
}: DeleteReviewDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => adminDeleteReview(review!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted permanently");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete review");
    },
  });

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-destructive/20 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center pt-4">
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Delete Review?
          </DialogTitle>
          <DialogDescription className="text-sm px-2">
            This action is permanent. You are about to delete the review
            <span className="text-xs text-foreground block mt-2">
              "{review.content}"
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/30 border border-border rounded-lg p-3 my-2">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">
            <Trash2 className="size-3" /> Warning
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Deleting this review will also remove all associated likes and
            comments from the database.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            size={"lg"}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
            size={"lg"}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
