import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllUsers = async (query: Record<string, unknown> = {}) => {
  const userQuery = new QueryBuilder(prisma.user, query as any, {
    searchableFields: ["name", "email"],
    filterableFields: ["role", "status", "emailVerified"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.execute();
  return result;
};

const getUserById = async (id: string) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isExist;
};

const updateProfile = async (id: string, data: any) => {
  const isExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const userUpdate: any = {};
  if (data.name) userUpdate.name = data.name;
  if (data.image) userUpdate.image = data.image;
  return await prisma.user.update({
    where: { id },
    data: {
      ...userUpdate,
      profile: {
        upsert: {
          update: {
            ...(data.name && { name: data.name }),
            ...(data.image && { image: data.image }),
            ...(data.bio && { bio: data.bio }),
          },

          create: {
            name: data.name || isExist.name,
            email: isExist.email,
            image: data.image || isExist.image,
            bio: data.bio || "",
          },
        },
      },
    },
    include: {
      profile: true,
    },
  });
};

const deleteUser = async (id: string) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

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

  if (
    user.role === Role.USER &&
    (user.status === UserStatus.DEACTIVATED ||
      user.status === UserStatus.ACTIVE ||
      user.status === UserStatus.DELETED)
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to change the status of this user",
    );
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

const toggleDeactivateUser = async (id: string, payload: any) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (isExist?.status === UserStatus.DELETED) {
    throw new AppError(status.BAD_REQUEST, "User not found");
  }

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
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
  toggleDeactivateUser,
};
