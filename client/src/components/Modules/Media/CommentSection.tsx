import { IProfileResponse } from "@/types/auth.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commentValidationSchema,
  CommentValidationType,
} from "@/zod/reaction.validation";
import { addComment, getComments } from "@/services/reaction.service";
import { Comment, Comment as ReviewComment } from "@/types/reaction.types";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface CommentSectionProps {
  showComments: boolean;
  reviewId: string;
  mediaId: string;
  currentUser: IProfileResponse | null;
}

export default function CommentSection({
  showComments,
  reviewId,
  mediaId,
  currentUser,
}: CommentSectionProps) {
  const router = useRouter();
  const queryclient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CommentValidationType) => addComment(payload),
    onSuccess: () => {
      router.refresh();
      queryclient.invalidateQueries({
        queryKey: ["reviews", reviewId],
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", reviewId],
    queryFn: () => getComments(reviewId),
  });

  const comments = data?.data || [];

  const form = useForm({
    defaultValues: {
      content: "",
    },

    onSubmit: async ({ value }) => {
      if (!currentUser) {
        toast.error("Please login or register to comment.");
        return;
      }

      try {
        const res = await mutateAsync({
          reviewId: reviewId,
          mediaId: mediaId,
          content: value.content,
          status: "APPROVED",
          userId: currentUser.id,
          type: "LIKE",
        });
        toast.success("Comment added!");
        form.reset();
      } catch (e) {
        toast.error("Failed to add comment");
      }
    },
  });
  return (
    <>
      {showComments && (
        <div
          className="w-full mt-4 space-y-4 border-t border-neutral-800 pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-3 items-center w-full">
            <Avatar className="size-8 hidden sm:block">
              <AvatarImage
                src={currentUser?.image || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>{currentUser?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <form
              className="w-full"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="content"
                validators={{
                  onChange: commentValidationSchema.shape.content,
                }}
                children={(field) => (
                  <div className="flex-1 flex items-center bg-secondary/30 rounded-lg pr-7 w-full">
                    <Input
                      placeholder={
                        field.state.meta.errors.length > 0
                          ? field.state.meta.errors[0]?.message
                          : "Write a comment..."
                      }
                      className={`border-0 bg-transparent focus-visible:ring-0 px-4 min-h-[40px] text-sm  ${field.state.meta.errors.length > 0 ? "placeholder:text-red-500" : ""}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit();
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      size="icon-lg"
                      variant="ghost"
                      className="h-8 w-8 text-primary shrink-0"
                      disabled={field.state.value.length === 0}
                    >
                      <Send />
                    </Button>
                  </div>
                )}
              />
            </form>
          </div>

          <div className="space-y-3 pt-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="size-7 animate-spin text-primary" />
              </div>
            ) : (
              comments?.map((comment: Comment) => (
                <div key={comment.id} className={`flex gap-3 `}>
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={comment.user?.image || ""} />
                    <AvatarFallback>
                      {comment.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`bg-secondary/20 rounded-2xl rounded-tl-sm px-4 py-3 flex-1 ${comment.status !== "PENDING" ? "border border-orange-500" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {comment.user?.name || "Unknown"}
                      </span>
                      <div className="flex items-center gap-3">
                        {currentUser?.id === comment.userId && (
                          <Badge>{comment.status}</Badge>
                        )}
                        <span className="text-[10px]">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            {comments?.length === 0 && (
              <div className="flex flex-col items-center justify-center my-11">
                <MessageCircle className="size-7 mb-3 text-muted-foreground" />
                <h3 className="text-center">No Comments Yet!</h3>
                <p className="text-xs text-muted-foreground">
                  Looks like no one has commented yet. Be the first one to share
                  your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
