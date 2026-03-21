import status from "http-status";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";

const createGenre = async (payload: { name: string }) => {
  const isExist = await prisma.genre.findUnique({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(status.BAD_REQUEST, "Genre already exists");
  }

  const result = await prisma.genre.create({
    data: payload,
  });
  return result;
};

const getAllGenres = async () => {
  return await prisma.genre.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const deleteGenre = async (id: string) => {
  const isExist = await prisma.genre.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Genre not found");
  }

  const result = await prisma.genre.delete({
    where: { id },
  });
  return result;
};

export const GenreService = {
  createGenre,
  getAllGenres,
  deleteGenre,
};
