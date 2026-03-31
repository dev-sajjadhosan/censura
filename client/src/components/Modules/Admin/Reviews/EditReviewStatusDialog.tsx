"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShieldCheck, AlertCircle, EyeOff } from "lucide-react";
import { Review } from "@/types/media.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminUpdateReviewStatus } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditReviewStatusDialogProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditReviewStatusDialog({
  review,
  open,
  onOpenChange,
}: EditReviewStatusDialogProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Review["status"]>("PENDING");

  // Sync state immediately on open
  useEffect(() => {
    if (review) setStatus(review.status);
  }, [review, open]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => adminUpdateReviewStatus(review!.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review status updated");
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-7">
        <DialogHeader>
          <DialogTitle>Update Moderation Status</DialogTitle>
          <DialogDescription>
            Current status:{" "}
            <span className="font-medium text-foreground">{review.status}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Review Preview Card */}
          <div className="rounded-xl bg-muted/40 p-3 space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-3">
              "{review.content}"
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
              <Avatar className="size-7">
                <AvatarImage
                  src={review.user?.image || "https://github.com/shadcn.png"}
                />
                <AvatarFallback className="text-[8px]">
                  {review.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{review.user?.name}</span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-5">
            <label className="text-sm font-semibold tracking-tight">
              New Status
            </label>
            <Select
              value={status}
              onValueChange={(value: any) => setStatus(value)}
            >
              <SelectTrigger className="w-full h-11 bg-background">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">
                  <div className="flex items-center gap-2 py-1">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span className="font-medium">Approved</span>
                  </div>
                </SelectItem>
                <SelectItem value="PENDING">
                  <div className="flex items-center gap-2 py-1">
                    <AlertCircle className="size-4 text-amber-500" />
                    <span className="font-medium">Pending Review</span>
                  </div>
                </SelectItem>
                <SelectItem value="UNPUBLISHED">
                  <div className="flex items-center gap-2 py-1">
                    <EyeOff className="size-4 text-destructive" />
                    <span className="font-medium">Unpublished</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-5 ">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            size={"lg"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutate()}
            disabled={isPending || status === review.status}
            size={"lg"}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
