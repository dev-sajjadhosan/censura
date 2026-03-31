"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { deleteReview } from "@/services/media.service";
import { toast } from "sonner";
import { Review } from "@/types/media.types";

export default function DeleteReviewDialog({ review }: { review: Review }) {
  console.log("review from delet:", review);

  const queryClient = useQueryClient();
  const { mutate: deleteReviewMutation, isPending: isDeletingReview } =
    useMutation({
      mutationFn: async (id: string) => {
        return await deleteReview(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["reviews", review.mediaId],
        });
        toast.success("Review deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete review");
      },
    });
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon-lg">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-xl! p-7 bg-muted flex flex-col items-center">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              review and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertDialogCancel size={"lg"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              size={"lg"}
              onClick={() => deleteReviewMutation(review.id)}
            >
              {isDeletingReview ? "Deleting..." : "Delete Review"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
