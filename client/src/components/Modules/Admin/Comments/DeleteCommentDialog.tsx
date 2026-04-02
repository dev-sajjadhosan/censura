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
import { adminDeleteComment } from "@/services/admin.service";
import { Comment } from "@/types/reaction.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteCommentDialog({
  comment,
  open,
  onOpenChange,
}: {
  comment: Comment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const querClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (commentId: string) => {
      await adminDeleteComment(commentId);
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      onOpenChange(false);
      querClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg! border p-7">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Delete Comment?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            comment and all its replies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-3">
          <AlertDialogCancel size={"lg"}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            size={"lg"}
            className="bg-destructive"
            onClick={() => mutateAsync(comment?.id as string)}
          >
            <Trash2 />
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
