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

export const PaymentService = {
  getMyPayments,
  getAllPayments,
};
