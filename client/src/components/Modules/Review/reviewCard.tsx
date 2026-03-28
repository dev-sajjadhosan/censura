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
  const [likesCount, setLikesCount] = useState<number>(
    review.likes?.length || 0,
  );

  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [commentsList, setCommentsList] = useState<any[]>(
    review.comments || [],
  );
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like this review");
      return;
    }

    try {
      setIsLiking(true);
      if (isLiked) {
        // Optimistic update
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);

        // Find my like id
        const myLike = review.likes?.find((l) => l.userId === currentUser.id);
        if (myLike) {
          await deleteLike(myLike?.id!, {
            reviewId: review.id,
            mediaId: review.mediaId,
            likeType: "LIKE",
          });
        }
      } else {
        // Optimistic update
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);

        await createLike({
          reviewId: review.id,
          mediaId: review.mediaId,
          likeType: "LIKE",
        });
      }
    } catch (e) {
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      toast.error("Failed to update like status");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {};

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
                {isOwn && review.status === "UNPUBLISHED" && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-neutral-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <p className={`text-neutral-300 text-md leading-relaxed p-3`}>
              {/* {review.content} */}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia
              eos eligendi sunt voluptatibus velit a, recusandae magni
              laboriosam similique inventore, et placeat maiores. Hic,
              itaque!Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Officia eos eligendi sunt voluptatibus velit a, recusandae magni
              laboriosam similique inventore, et placeat maiores. Hic,
              itaque!Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Officia eos eligendi sunt voluptatibus velit a, recusandae magni
              laboriosam similique inventore, et placeat maiores. Hic, itaque!
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
                disabled={isLiking || !currentUser}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLike();
                }}
              >
                <ThumbsUp
                  className={`w-4 h-4 ${isLiked ? "fill-primary" : ""}`}
                />
                <span>Like</span>
                <Badge className="text-xs ml-1">{likesCount}</Badge>
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
                <Badge className="text-xs ml-1">{commentsList.length}</Badge>
              </Button>
            </div>

            <CommentSection
              showComments={showComments}
              commentContent={commentContent}
              setCommentContent={setCommentContent}
              handleAddComment={handleAddComment}
              reviewId={review.id}
              mediaId={review.mediaId}
              commentsList={commentsList}
              currentUser={currentUser!}
            />
          </CardFooter>
        </div>
      </Card>
    </>
  );
}
