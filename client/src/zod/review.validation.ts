import { z } from "zod";

export const CreateReviewValidation = z.object({
  content: z.string().min(10, "Review content is required"),
  rating: z.number().min(1, "Rating is required"),
  hasSpoiler: z.boolean(),
  tags: z
    .string()
    .min(1, "Tags are required")
    .transform((val) =>
      val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
});

export const UpdateReviewValidation = z.object({
  content: z.string().min(10, "Review content is required"),
  rating: z.number().min(1, "Rating is required"),
  hasSpoiler: z.boolean(),
  tags: z.array(z.string("Tag must be a string.")).min(1, "Tags are required"),
});

export type CreateReviewValidationType = z.infer<typeof CreateReviewValidation>;
export type UpdateReviewValidationType = z.infer<typeof UpdateReviewValidation>;
