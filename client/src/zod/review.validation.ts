import { z } from "zod";

export const CreateReviewValidation = z.object({
  content: z.string().min(10, "Review content is required"),
  rating: z.number().min(1, "Rating is required"),
  hasSpoiler: z.boolean(),
  tags: z
    .string("Tag must be a string.")
    .min(3, "Tags are required. Please add 1/2 tag related to your review."),
});

export const UpdateReviewValidation = z.object({
  content: z.string().min(10, "Review content is required"),
  rating: z.number().min(1, "Rating is required"),
  hasSpoiler: z.boolean(),
  tags: z
    .string("Tag must be a string.")
    .min(3, "Tags are required. Please add 1/2 tag related to your review."),
});

export type CreateReviewValidationType = z.infer<typeof CreateReviewValidation>;
export type UpdateReviewValidationType = z.infer<typeof UpdateReviewValidation>;
