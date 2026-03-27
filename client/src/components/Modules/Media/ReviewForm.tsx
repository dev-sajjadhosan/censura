"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2 } from "lucide-react";
import { createReview } from "@/services/media.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import {
  CreateReviewValidation,
  CreateReviewValidationType,
} from "@/zod/review.validation";
import { User } from "@/types/auth.types";
import ReviewSection from "./ReviewSection";
import { Review } from "@/types/media.types";

export default function ReviewForm({
  mediaId,
  user,
  initialReviews,
}: {
  mediaId: string;
  user: User;
  initialReviews?: Review[];
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateReviewValidationType) => createReview(payload),
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
          tags: value.tags,
          status: "PENDING", // Default on backend
          userId: user.id,
        };
        console.log(data);
        const res = (await mutateAsync(data)) as any;
        toast.success("Review submitted for approval!");
        // form.reset();
        console.log("Review submitted successfully:", res);
        // Ideally refresh reviews here or just show a message
      } catch (error: any) {
        console.error("Error submitting review:", error);
        toast.error(error.message || "Failed to submit review");
      }
    },
  });

  return (
    <div className="space-y-12 mt-7">
      {user && (
        <section className="bg-muted/50 p-7 rounded-xl">
          <h3 className="text-lg text-muted-foreground mb-6">Write a Review</h3>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="content"
              validators={{ onChange: CreateReviewValidation.shape.content }}
              children={(field) => (
                <>
                  <Textarea
                    placeholder="What did you think of this title? (Share your thoughts...)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="p-5 border-0 resize-none"
                    rows={9}
                    required
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
            <form.Field
              name="tags"
              validators={{ onChange: CreateReviewValidation.shape.tags }}
              children={(field) => (
                <>
                  <Input
                    placeholder="Add tags related to your review (comma separated)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="p-5 border-0 bg-secondary text-sm"
                    required
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
            <div className="flex items-center justify-between">
              <form.Field
                name="rating"
                validators={{ onChange: CreateReviewValidation.shape.rating }}
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
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              />

              <form.Field
                name="hasSpoiler"
                children={(field) => (
                  <Label
                    className={`flex items-center gap-2 cursor-pointer group bg-secondary py-4 px-6 rounded-xl ${field.state.value ? " bg-red-500/20" : ""}`}
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
              disabled={form.state.isSubmitting || isPending}
              className="rounded-lg"
              size={"xl"}
            >
              {form.state.isSubmitting || isPending
                ? "Submitting..."
                : "Post Review"}
            </Button>
          </form>
        </section>
      )}

      <ReviewSection initialReviews={[]} user={user} />
    </div>
  );
}
