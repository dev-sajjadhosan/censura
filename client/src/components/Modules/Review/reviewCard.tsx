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
import { Edit, Eye, MessageSquare, Star, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ReviewCard({
  review,
  isOwn,
}: {
  review: Review;
  isOwn: boolean;
}) {
  const [reveal, setReveal] = useState<boolean>(false);

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
          <CardFooter>
            <div className="flex items-center gap-6">
              <Button size={"lg"} variant={"ghost"} className="">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
                <Badge className="text-xs">{review?.likes?.length}</Badge>
              </Button>
              <Button size={"lg"} variant={"ghost"} className="">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
                <Badge className="text-xs">{review?.comments?.length}</Badge>
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>
    </>
  );
}
