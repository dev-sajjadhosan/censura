import { z } from "zod";

export const commentValidationSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  mediaId: z.string(),
  reviewId: z.string(),
  status: z.string(),
  userId: z.string(),
  type: z.enum(["LIKE", "HEART", "CRY", "LAUGH", "DISLIKE"]),
});
export const updateCommentValidationSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  id: z.string(),
  userId: z.string(),
  reviewId: z.string(),
  mediaId: z.string(),
  status: z.string(),
  type: z.enum(["LIKE", "HEART", "CRY", "LAUGH", "DISLIKE"]),
});

export type CommentValidationType = z.infer<typeof commentValidationSchema>;
export type UpdateCommentValidationType = z.infer<
  typeof updateCommentValidationSchema
>;
