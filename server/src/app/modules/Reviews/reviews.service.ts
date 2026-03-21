import status from "http-status";
import { ReviewStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllReview = async (user: IRequestUser, query: any) => {
  const result = await prisma.review.findMany();
  return result;
};

const getSingleReview = async (id: string) => {
  const result = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const getReviewByMediaId = async (mediaId: string) => {
  const isMediaExist = await prisma.media.findUnique({
    where: {
      id: mediaId,
    },
  });

  if (!isMediaExist) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  const result = await prisma.review.findMany({
    where: {
      mediaId,
      status: "APPROVED",
    },
    include: {
      user: true,
    },
  });
  return result;
};

const createReview = async (user: IRequestUser, data: any) => {
  const result = await prisma.review.create({
    data: {
      userId: user.userId,
      ...data,
    },
  });
  return result;
};

const updateReview = async (id: string, data: any) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.update({
    where: {
      id,
      status: "UNPUBLISHED",
    },
    data: {
      ...data,
    },
  });
  return result;
};

const deleteReview = async (id: string) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.delete({
    where: {
      id,
      status: "UNPUBLISHED",
    },
  });
  return result;
};

const updateReviewStatus = async (
  id: string,
  payload: { status: ReviewStatus },
) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const deleteReviewByAdmin = async (id: string) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ReviewsService = {
  getAllReview,
  getSingleReview,
  getReviewByMediaId,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  deleteReviewByAdmin,
};
