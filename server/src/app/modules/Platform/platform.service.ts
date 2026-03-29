import status from "http-status";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createPlatform = async (payload: Prisma.PlatformCreateInput) => {
  const isExist = await prisma.platform.findUnique({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(status.BAD_REQUEST, "Platform already exists");
  }

  const result = await prisma.platform.create({
    data: payload,
  });
  return result;
};

const getAllPlatforms = async (query: Record<string, unknown>) => {
  const platformQuery = new QueryBuilder(prisma.platform, query as any, {
    searchableFields: ["name", "slug", "description"],
    filterableFields: ["isFeatured", "isPublished"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await platformQuery.execute();
  return result;
};

const updatePlatform = async (
  id: string,
  payload: Prisma.PlatformUpdateInput,
) => {
  const isExist = await prisma.platform.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Platform not found");
  }

  const result = await prisma.platform.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deletePlatform = async (id: string) => {
  const isExist = await prisma.platform.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Platform not found");
  }

  const result = await prisma.platform.delete({
    where: { id },
  });
  return result;
};

export const PlatformService = {
  createPlatform,
  getAllPlatforms,
  updatePlatform,
  deletePlatform,
};
