import { IRequestUser } from "../../interfaces";
import { prisma } from "../../lib/prisma";
import AppError from "../../error-helpers/AppError";
import status from "http-status";

const getMyPayments = async (user: IRequestUser) => {
  return await prisma.payment.findMany({
    where: {
      subscription: {
        userId: user.userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      subscription: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMyMediaPurchases = async (user: IRequestUser) => {
  return await prisma.mediaPurchase.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      media: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createMediaPurchase = async (user: IRequestUser, payload: any) => {
  const result = await prisma.mediaPurchase.create({
    data: {
      userId: user.userId,
      ...payload,
    },
  });
  return result;
};

export const PaymentService = {
  getMyPayments,
  getAllPayments,
  getMyMediaPurchases,
  createMediaPurchase,
};
