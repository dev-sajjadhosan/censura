import { z } from "zod";

const createLikeValidation = z.object({
  reviewId: z.string("Review ID is required"),
  type: z.enum(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]),
  mediaId: z.string("Media ID is required"),
  commentId: z.string("Comment ID is required").optional(),
  parentId: z.string("Parent ID is required").optional(),
});

const deleteLikeValidation = z.object({
  reviewId: z.string("Review ID is required"),
  type: z.enum(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]),
  mediaId: z.string("Media ID is required"),
  commentId: z.string("Comment ID is required").optional(),
  parentId: z.string("Parent ID is required").optional(),
});

const createCommentValidation = z.object({
  reviewId: z.string("Review ID is required"),
  mediaId: z.string("Media ID is required"),
  content: z.string("Comment content is required"),
  parentId: z.string("Parent ID is required").optional(),
  status: z.enum(["PENDING", "APPROVED", "UNPUBLISHED", "REJECTED", "BLOCKED"]),
});

const deleteCommentValidation = z.object({
  reviewId: z.string("Review ID is required"),
  mediaId: z.string("Media ID is required"),
  content: z.string("Comment content is required"),
  parentId: z.string("Parent ID is required").optional(),
});

const createCommentReplyValidation = z.object({
  reviewId: z.string("Review ID is required"),
  mediaId: z.string("Media ID is required"),
  parentId: z.string("Parent ID is required"),
  content: z.string("Comment content is required"),
  status: z.enum(["PENDING", "APPROVED", "UNPUBLISHED", "REJECTED", "BLOCKED"]),
});

const updateCommentValidation = z.object({
  reviewId: z.string("Review ID is required"),
  mediaId: z.string("Media ID is required"),
  parentId: z.string("Parent ID is required").optional(),
  content: z.string("Comment content is required"),
  status: z.enum(["PENDING", "APPROVED", "UNPUBLISHED", "REJECTED", "BLOCKED"]),
});

const adminDeleteCommentValidation = z.object({
  reviewId: z.string("Review ID is required"),
  mediaId: z.string("Media ID is required"),
  parentId: z.string("Parent ID is required").optional(),
  content: z.string("Comment content is required"),
});

export const ReactionValidation = {
  createLikeValidation,
  deleteLikeValidation,
  createCommentValidation,
  deleteCommentValidation,
  createCommentReplyValidation,
  updateCommentValidation,
  adminDeleteCommentValidation,
};
