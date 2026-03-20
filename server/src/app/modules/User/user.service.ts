import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllUsers = async (query?: Record<string, any>) => {
  //query-builder implement

  return await prisma.user.findMany();
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const updateProfile = async (id: string, data: Record<string, any>) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

const changeStatus = async (
  id: string,
  payload: {
    status: UserStatus;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (user.status === payload.status) {
    throw new AppError(status.BAD_REQUEST, "User is already in this status");
  }

  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changeStatus,
};
