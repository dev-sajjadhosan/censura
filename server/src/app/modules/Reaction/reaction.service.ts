import { Prisma } from "../../../generated/prisma/client";
import { IRequestUser } from "../../interfaces";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllComments = async (query: Record<string, unknown>, user: IRequestUser) => {
  const commentQuery = new QueryBuilder(prisma.comment, query as any, {
    searchableFields: ["content"],
    filterableFields: ["userId", "mediaId", "reviewId", "parentId"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields()
    .include({
      user: true,
      replies: true,
    });

  const result = await commentQuery.execute();
  return result;
};

const createReviewLike = async (
  user: IRequestUser,
  data: Prisma.LikeCreateInput,
) => {
  const result = await prisma.like.create({
    data: {
      userId: user.userId as any,
      ...data,
    },
  });
  return result;
};

const deleteReviewLike = async (id: string) => {
  const result = await prisma.like.delete({
    where: {
      id,
    },
  });
  return result;
};

const createReviewComment = async (user: IRequestUser, data: any) => {
  const review = await prisma.review.findUnique({
    where: {
      id: data.reviewId,
    },
  });
  if (!review) {
    throw new AppError(404, "Review not found");
  }

  const media = await prisma.media.findUnique({
    where: {
      id: review.mediaId,
    },
  });
  if (!media) {
    throw new AppError(404, "Media not found");
  }

  const isCommentExist = await prisma.comment.findUnique({
    where: {
      id: data.reviewId,
    },
  });
  if (isCommentExist) {
    throw new AppError(400, "Comment already exists");
  }
  const result = await prisma.comment.create({
    data: {
      userId: user.userId as any,
      reviewId: review.id,
      mediaId: review.mediaId,
      content: data.content,
    },
  });
  return result;
};

const createCommentReply = async (
  user: IRequestUser,
  data: Prisma.CommentCreateInput,
) => {
  const parentComment = await prisma.comment.findUnique({
    where: {
      id: data.parent as any,
    },
  });
  if (!parentComment) {
    throw new AppError(404, "Parent comment not found");
  }
  const result = await prisma.comment.create({
    data: {
      userId: user.userId as any,
      parentId: parentComment.id,
      reviewId: parentComment.reviewId,
      mediaId: parentComment.mediaId,
      content: data.content,
    },
  });
  return result;
};

const updateReviewComment = async (
  user: IRequestUser,
  id: string,
  data: any,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }
  if (comment.userId !== user.userId) {
    throw new AppError(403, "You are not authorized to update this comment");
  }
  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content: data.content,
    },
  });
  return result;
};

const deleteReviewComment = async (user: IRequestUser, id: string) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }
  if (comment.userId !== user.userId) {
    throw new AppError(403, "You are not authorized to delete this comment");
  }
  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return result;
};

const adminDeleteReviewComment = async (id: string) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }
  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return result;
};

export const LikesService = {
  getAllComments,
  createReviewLike,
  deleteReviewLike,
  createReviewComment,
  deleteReviewComment,
  createCommentReply,
  updateReviewComment,
  adminDeleteReviewComment,
};
