"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Review } from "@/types/media.types";
import {
  Edit,
  Eye,
  MessageSquare,
  Star,
  ThumbsUp,
  Trash2,
  Send,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { IProfileResponse } from "@/types/auth.types";
import {
  createLike,
  deleteLike,
  addComment as addCommentApi,
} from "@/services/reaction.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import CommentSection from "../Media/CommentSection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "@/services/media.service";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewDialog from "./DeleteReviewDialog";

export default function ReviewCard({
  review,
  isOwn,
  currentUser,
}: {
  review: Review;
  isOwn: boolean;
  currentUser?: IProfileResponse | null;
}) {
  const [reveal, setReveal] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    return (
      review.likes?.some((like) => like.userId === currentUser?.id) || false
    );
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createLikeMutation, isPending: isCreatingLike } =
    useMutation({
      mutationFn: async (payload: any) => {
        return await createLike(payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["reviews", review.mediaId],
        });
        toast.success("Review liked successfully");
      },
      onError: () => {
        toast.error("Failed to like review");
      },
    });

  const { mutateAsync: deleteLikeMutation, isPending: isDeletingLike } =
    useMutation({
      mutationFn: async ({
        likeId,
        payload,
      }: {
        likeId: string;
        payload: any;
      }) => {
        return await deleteLike(likeId, payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["reviews", review.mediaId],
        });
        toast.success("Review unliked successfully");
      },
      onError: () => {
        toast.error("Failed to unlike review");
      },
    });

  const [showComments, setShowComments] = useState<boolean>(false);

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like this review");
      return;
    }

    try {
      if (isLiked) {
        const myLike = review.likes?.find((l) => l.userId === currentUser.id);
        if (myLike) {
          await deleteLikeMutation({
            likeId: myLike?.id!,
            payload: {
              reviewId: review.id,
              mediaId: review.mediaId,
              userId: currentUser.id,
              type: "LIKE",
            },
          });
        }
      } else {
        const resLike = await createLikeMutation({
          reviewId: review.id,
          mediaId: review.mediaId,
          userId: currentUser.id,
          type: "LIKE",
        });
      }
    } catch (e) {
      toast.error("Failed to update like status");
    }
  };

  return (
    <>
      <Card className="relative p-0" onClick={() => setReveal(true)}>
        {review.hasSpoiler && !reveal && (
          <div className="absolute w-full h-full flex flex-col gap-1 items-center justify-center cursor-pointer">
            <Eye className="size-7" />
            <h3 className="text-xl">Spoiler Review</h3>
            <p className="text-sm text-red-500">Click to reveal the review</p>
          </div>
        )}
        <div className={` ${review.hasSpoiler && !reveal ? "blur-md" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarImage src={review.user?.image} />
                  <AvatarFallback>
                    {review.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="tracking-wide">
                    {review.user?.name || "Anonymous"}
                  </h4>
                  <Badge variant={"secondary"} className="text-xs">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-orange-700/20 text-orange-700 px-3 py-1 rounded-full">
                  <Star className="size-4 fill-orange-700" />
                  {review.rating}/10
                </div>
                {review.hasSpoiler && (
                  <Badge variant={"default"} className="py-3">
                    Spoiler
                  </Badge>
                )}
                {currentUser?.role === "ADMIN" && (
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
                )}
                {isOwn &&
                  (review.status === "UNPUBLISHED" ||
                    review.status === "PENDING") && (
                    <div className="flex gap-2">
                      <EditReviewModal
                        initialReview={review}
                        user={currentUser!}
                      />
                      <DeleteReviewDialog review={review} />
                    </div>
                  )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <p className={`text-neutral-300 text-md leading-relaxed p-3`}>
              {review.content}
            </p>

            <div className="flex flex-wrap gap-2">
              {review.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full uppercase tracking-tighter"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col pb-0 mb-4 w-full items-start bg-transparent">
            <div className="flex items-center gap-6 w-full">
              <Button
                size={"lg"}
                variant={"ghost"}
                className={isLiked ? "text-primary bg-primary/10" : ""}
                disabled={isCreatingLike || isDeletingLike || !currentUser}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLike();
                }}
              >
                <ThumbsUp className={`${isLiked ? "fill-primary" : ""}`} />
                <span>Like</span>
                <Badge className="text-xs ml-1">{review?.likes?.length}</Badge>
              </Button>
              <Button
                size={"lg"}
                variant={"ghost"}
                // disabled={!currentUser}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(!showComments);
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
                <Badge className="text-xs ml-1">
                  {review?.comments?.length}
                </Badge>
              </Button>
            </div>

            {currentUser?.role === "ADMIN" && (
              <div className="mt-4 pt-4 border-t border-border w-full">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Admin Controls:
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                    disabled={review.status === "APPROVED"}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                    disabled={review.status === "UNPUBLISHED"}
                  >
                    Unpublish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}

            <CommentSection
              showComments={showComments}
              reviewId={review.id}
              mediaId={review.mediaId}
              currentUser={currentUser!}
            />
          </CardFooter>
        </div>
      </Card>
    </>
  );
}
