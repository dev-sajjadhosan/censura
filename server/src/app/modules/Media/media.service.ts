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
    searchableFields: ["title", "synopsis", "director"],
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
    where: { id },
    include: {
      genres: true,
      platforms: {
        include: {
          platform: true, // include platform details
        },
      },
      cast: true,
    },
  });
  return result;
};

const createMedia = async (user: IRequestUser, payload: any) => {
  const { genres, platforms, cast, ...mediaData } = payload;

  if (genres?.length > 0) {
    await prisma.genre.findFirstOrThrow({
      where: { id: { in: genres } },
    });
  }

  const result = await prisma.media.create({
    data: {
      ...mediaData,
      release: Number(mediaData.release),
      runtime: Number(mediaData.runtime),
      seasons: Number(mediaData.seasons),
      genres:
        genres?.length > 0
          ? { connect: genres.map((id: string) => ({ id })) }
          : undefined,
      platforms:
        platforms?.length > 0
          ? { connect: platforms.map((id: string) => ({ id })) }
          : undefined,
      cast: cast?.length > 0 ? { create: cast } : undefined,
    },
  });

  return result;
};

const updateMedia = async (id: string, user: IRequestUser, payload: any) => {
  const { genres, platforms, cast, ...mediaData } = payload; // ← extract cast too

  await prisma.media.findUniqueOrThrow({ where: { id } }); // findUniqueOrThrow already throws if not found, no need for manual check

  const result = await prisma.media.update({
    where: { id },
    data: {
      ...mediaData,
      // coerce numbers same as create
      ...(mediaData.release && { release: Number(mediaData.release) }),
      ...(mediaData.runtime && { runtime: Number(mediaData.runtime) }),
      ...(mediaData.seasons && { seasons: Number(mediaData.seasons) }),

      // genres — set replaces all, correct
      genres: genres
        ? { set: genres.map((id: string) => ({ id })) }
        : undefined,

      // platforms — was wrong, fix connect like create
      platforms: platforms
        ? {
            set: platforms.map((id: string) => ({ id })), // ← connect by ID not create
          }
        : undefined,

      // cast — delete old ones and recreate
      cast: cast
        ? {
            deleteMany: {}, // ← wipe existing cast
            create: cast, // ← recreate with new data
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

  if (media.isPublished === true) {
    throw new AppError(status.BAD_REQUEST, "Unpublish media before deleting");
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
    where: { slug },
    include: {
      genres: true,
      platforms: {
        include: { platform: true },
      },
      cast: true,
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
