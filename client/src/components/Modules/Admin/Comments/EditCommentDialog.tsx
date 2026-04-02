"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminCommentStatusChange } from "@/services/admin.service";
import { Comment } from "@/types/reaction.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function StatusCommentDialog({
  comment,
  open,
  onOpenChange,
}: {
  comment: Comment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isPublished = comment?.status === "PUBLISHED";
    const querClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newStatus: string) => {
      await adminCommentStatusChange(comment?.id as string, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      toast.success(
        `Comment ${isPublished ? "unpublished" : "published"} successfully`,
      );
        onOpenChange(false);
        querClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
    onError: () => {
      toast.error("Failed to update comment status");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-xl! border">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Comment Status?</AlertDialogTitle>
          <AlertDialogDescription>
            This will {isPublished ? "hide" : "show"} the comment on the public
            media page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Select
          defaultValue={comment?.status}
          onValueChange={(value) => mutateAsync(value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Comment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
              <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div>
          <AlertDialogCancel size={"lg"}>Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
