import status from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interfaces";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllMedia = async (
  user: IRequestUser,
  query: Record<string, unknown>,
) => {
  const mediaQuery = new QueryBuilder(prisma.media, query as any, {
    searchableFields: ["title", "synopsis", "director", "cast"],
    filterableFields: [
      "type",
      "genres.some.id",
      "platforms.some.platformId",
      "releaseYear",
      "pricing",
      "avgRating",
      "isFeatured",
      "isPublished",
    ],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await mediaQuery.execute();
  return result;
};

const getSingleMedia = async (id: string) => {
  const result = await prisma.media.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const createMedia = async (user: IRequestUser, payload: any) => {
  const { genres, platforms, ...mediaData } = payload;

  if (genres && genres.length > 0) {
    await prisma.genre.findFirstOrThrow({
      where: {
        id: {
          in: genres,
        },
      },
    });
  }

  const result = await prisma.media.create({
    data: {
      ...mediaData,
      genres:
        genres && genres.length > 0
          ? { connect: genres.map((id: string) => ({ id })) }
          : undefined,
      platforms:
        platforms && platforms.length > 0 ? { create: platforms } : undefined,
    },
  });
  return result;
};

const updateMedia = async (id: string, user: IRequestUser, payload: any) => {
  const { genres, platforms, ...mediaData } = payload;

  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!media) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  const result = await prisma.media.update({
    where: {
      id,
    },
    data: {
      ...mediaData,
      genres: genres
        ? { set: genres.map((id: string) => ({ id })) }
        : undefined,
      platforms: platforms
        ? {
            deleteMany: {},
            create: platforms,
          }
        : undefined,
    },
  });
  return result;
};

const deleteMedia = async (id: string) => {
  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!media) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  if (media.isPublished === false) {
    throw new AppError(status.BAD_REQUEST, "Media is not published");
  }

  const result = await prisma.media.delete({
    where: {
      id,
    },
  });
  return result;
};

const changeFeaturedStatus = async (
  id: string,
  payload: { isFeatured: boolean },
) => {
  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!media) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  if (media.isFeatured === payload.isFeatured) {
    throw new AppError(status.BAD_REQUEST, "Media is already featured");
  }
  const result = await prisma.media.update({
    where: {
      id,
    },
    data: {
      isFeatured: payload.isFeatured,
    },
  });
  return result;
};

const changePublishStatus = async (
  id: string,
  payload: { isPublished: boolean },
) => {
  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!media) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  if (media.isPublished === payload.isPublished) {
    throw new AppError(
      status.BAD_REQUEST,
      `Media is already ${payload.isPublished ? "Published" : "Unpublished"}`,
    );
  }
  const result = await prisma.media.update({
    where: {
      id,
    },
    data: {
      isPublished: payload.isPublished,
    },
  });
  return result;
};

const getMediaBySlug = async (slug: string) => {
  const result = await prisma.media.findUniqueOrThrow({
    where: {
      slug,
    },
    include: {
      genres: true,
      platforms: true,
    },
  });
  return result;
};

export const MediaService = {
  getAllMedia,
  getSingleMedia,
  getMediaBySlug,
  createMedia,
  updateMedia,
  deleteMedia,
  changeFeaturedStatus,
  changePublishStatus,
};
