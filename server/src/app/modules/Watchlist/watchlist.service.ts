import status from "http-status";
import AppError from "../../error-helpers/AppError";
import { IRequestUser } from "../../interfaces";
import { prisma } from "../../lib/prisma";

const getAllWatchlist = async (user: IRequestUser, query: any) => {
  const result = await prisma.watchlist.findMany({
    where: {
      userId: user.userId as any,
    },
    include: {
      media: true,
    },
  });
  return result;
};

const createWatchlist = async (payload: any, user: IRequestUser) => {
  const isExist = await prisma.watchlist.findFirst({
    where: {
      userId: user.userId as any,
      mediaId: payload.mediaId,
    },
  });
  if (isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You already added this media to your watchlist",
    );
  }
  const result = await prisma.watchlist.create({
    data: {
      userId: user.userId as any,
      ...payload,
    },
  });
  return result;
};

const deleteWatchlist = async (id: string, user: IRequestUser) => {
  const isExist = await prisma.watchlist.findFirst({
    where: {
      id,
      userId: user.userId as any,
    },
  });
  if (!isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You didn't add this media to your watchlist",
    );
  }
  const result = await prisma.watchlist.delete({
    where: {
      id,
      userId: user.userId as any,
    },
  });
  return result;
};

export const WatchlistService = {
  getAllWatchlist,
  createWatchlist,
  deleteWatchlist,
};
