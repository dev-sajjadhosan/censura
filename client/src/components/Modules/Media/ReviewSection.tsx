"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Edit,
  Check,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { createReview, getMediaReviews } from "@/services/media.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ReviewSection({
  mediaId,
  initialReviews = [],
  user,
}: {
  mediaId: string;
  initialReviews: any[];
  user: any;
}) {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (payload) => createReview(payload),
  });

  const form = useForm({
    defaultValues: {
      content: "",
      rating: 0,
      hasSpoiler: false,
      tags: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const data = {
          mediaId,
          content: value.content,
          rating: value.rating,
          hasSpoiler: value.hasSpoiler,
          tags: value.tags.split(",").map((tag) => tag.trim()),
          status: "PENDING", // Default on backend
          userId: user.id,
        };
        console.log(data);
        // await createReview();
        toast.success("Review submitted for approval!");
        // form.reset();
        // Ideally refresh reviews here or just show a message
      } catch (error: any) {
        toast.error(error.message || "Failed to submit review");
      }
    },
  });

  return (
    <div className="space-y-12 mt-7">
      {/* Review Form */}
      {user && (
        <section className="bg-muted/50 p-7 rounded-xl">
          <h3 className="text-lg text-muted-foreground mb-6">Write a Review</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="content"
              children={(field) => (
                <Textarea
                  placeholder="What did you think of this title? (Share your thoughts...)"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="p-5 border-0 resize-none"
                  rows={9}
                  required
                />
              )}
            />
            <form.Field
              name="tags"
              children={(field) => (
                <Input
                  placeholder="Add tags related to your review (comma separated)"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="p-5 border-0 bg-secondary text-sm"
                  required
                />
              )}
            />
            <div className="flex items-center justify-between">
              <form.Field
                name="rating"
                children={(field) => (
                  <>
                    <div className="flex flex-col items-start gap-2 mb-4">
                      <div className="flex items-center justify-between w-xs">
                        <label className="text-sm font-medium text-muted-foreground">
                          Your Review Rating?
                        </label>
                        <span className="text-sm">{field.state.value}/10</span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => field.handleChange(i + 1)}
                            className={`transition-all ${form.state.values.rating >= i + 1 ? "text-secondary scale-110" : "text-neutral-600 hover:text-secondary"}`}
                          >
                            <Star
                              className={`size-5 ${form.state.values.rating >= i + 1 ? "fill-orange-700 text-orange-700" : ""}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              />

              <form.Field
                name="hasSpoiler"
                children={(field) => (
                  <Label
                    className={`flex items-center gap-2 cursor-pointer group bg-secondary py-4 px-6 rounded-xl ${field.state.value ? "border border-red-500 bg-red-500/20" : ""}`}
                  >
                    <Checkbox
                      hidden
                      checked={field.state.value}
                      onCheckedChange={(value: boolean) =>
                        field.handleChange(value)
                      }
                      className="accent-primary"
                    />
                    <span
                      className={`text-sm flex items-center gap-3 ${field.state.value ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      <CheckCircle2 className="size-5" />
                      Contains Spoilers
                    </span>
                  </Label>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={form.state.isSubmitting}
              className="rounded-lg"
              size={"xl"}
            >
              {form.state.isSubmitting ? "Submitting..." : "Post Review"}
            </Button>
          </form>
        </section>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">See All Reviews</h2>
          <p className="text-sm text-muted-foreground">
            {initialReviews?.length} Reviews
          </p>
        </div>

        <div className="grid gap-6">
          {initialReviews?.map((review: any) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwn={user?.id === review.userId}
            />
          ))}
          {initialReviews?.length === 0 && (
            <div className="py-12 text-center bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800">
              <p className="text-neutral-500">
                No approved reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, isOwn }: { review: any; isOwn: boolean }) {
  const [reveal, setReveal] = useState(false);

  return (
    <>
      <Card className="relative p-0" onClick={() => setReveal(true)}>
        {!reveal && (
          <div className="absolute inset-0 w-full h-full flex flex-col gap-1 items-center justify-center cursor-pointer">
            <Eye className="size-7 text-neutral-500" />
            <h3 className="text-2xl font-bold">Spoiler Review</h3>
            <p className="text-sm text-muted-foreground">Click to reveal</p>
          </div>
        )}
        <div className={` ${reveal ? "" : "blur-md"}`}>
          <CardHeader>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarImage src={review.user?.avatar} />
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-orange-700/20 text-orange-700 px-3 py-1 rounded-full">
                  <Star className="size-4 fill-orange-700" />
                  {review.rating}/10
                </div>
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
            <p
              className={`text-neutral-300 text-md leading-relaxed p-3`}
            >
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
              <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
              </button>
            </div>
          </CardFooter>
        </div>
      </Card>
    </>
  );
}
