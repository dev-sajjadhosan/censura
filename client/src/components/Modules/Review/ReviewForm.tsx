"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2 } from "lucide-react";
import { createReview, updateReview } from "@/services/media.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { CreateReviewValidation } from "@/zod/review.validation";
import { IProfileResponse } from "@/types/auth.types";
import { Review } from "@/types/media.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReviewForm({
  mediaId,
  user,
  initialReview,
  isEdit,
}: {
  mediaId: string;
  user: IProfileResponse | null;
  initialReview?: Review;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialReview;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: any) =>
      isEditMode
        ? updateReview(initialReview.id, payload)
        : createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] });
      toast.success(
        isEditMode ? "Review updated!" : "Review submitted for approval!",
      );
    },
    onError: (error: any) => {
      toast.error(
        isEditMode ? "Failed to update review" : "Failed to submit review",
      );
    },
  });

  const form = useForm({
    defaultValues: {
      content: initialReview?.content || "",
      rating: initialReview?.rating || 0,
      hasSpoiler: initialReview?.hasSpoiler || false,
      tags: initialReview?.tags?.join(", ") || "", // Join tags array back to string
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          mediaId,
          content: value.content,
          rating: value.rating,
          hasSpoiler: value.hasSpoiler,
          tags: value.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          userId: user?.id,
          
        };

        await mutateAsync(payload);
        if (!isEditMode) form.reset();
        router.refresh();
      } catch (error: any) {
        console.log(error);
      }
    },
  });

  return (
    <div className="space-y-12">
      {user ? (
        <section
          className={`p-7 ${isEdit ? "" : "bg-secondary/35 rounded-xl"}`}
        >
          {!isEdit && (
            <h3 className="text-lg text-muted-foreground mb-6">
              Write a Review
            </h3>
          )}
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
                    className="p-5 border-0 resize-none bg-background!"
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
                    className="p-5 border-0 bg-background text-sm"
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
              disabled={isPending}
              className="w-full md:w-auto rounded-lg"
              size={"xl"}
            >
              {isPending
                ? "Saving..."
                : isEditMode
                  ? "Update Review"
                  : "Post Review"}
            </Button>
          </form>
        </section>
      ) : (
        <div className="bg-secondary/35 p-17 rounded-xl flex flex-col md:flex-row gap-5 items-center justify-between">
          <div className="flex flex-col text-center md:text-left">
            <h3 className="text-muted-foreground mb-1">To Write a Review</h3>
            <p className="text-muted-foreground">Please login or register.</p>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login">
              <Button size={"lg"} variant={"secondary"}>
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size={"lg"} variant={"secondary"}>
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
