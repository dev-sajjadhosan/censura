import status from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interfaces";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { normalizeIds, parseNullableNumber } from "../../utils/serviceHelpers";

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
  const result = await prisma.media.findUnique({
    where: { id },
    include: {
      genres: true,
      platforms: { include: { platform: true } },
      cast: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  return result;
};

const createMedia = async (user: IRequestUser, payload: any) => {
  const {
    genres,
    platforms,
    cast,
    slug,
    releaseYear,
    runtimeMinutes,
    seasons,
    ...mediaData
  } = payload;

  const slugMaker = slug
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the media first
    const media = await tx.media.create({
      data: {
        ...mediaData,
        slug: slugMaker,
        releaseYear: Number(releaseYear),
        runtimeMinutes: Number(runtimeMinutes) || null,
        seasons: Number(seasons) || null,
      },
    });

    // 2. Connect genres (they already exist, just link them)
    if (genres?.length > 0) {
      // Verify all genres exist first
      const existingGenres = await tx.genre.findMany({
        where: { id: { in: genres } },
        select: { id: true },
      });

      if (existingGenres.length !== genres.length) {
        throw new AppError(status.BAD_REQUEST, "One or more genres not found");
      }

      await tx.media.update({
        where: { id: media.id },
        data: {
          genres: { connect: genres.map((id: string) => ({ id })) },
        },
      });
    }

    // 3. Connect platforms via MediaPlatform join table
    if (platforms?.length > 0) {
      // Verify all platforms exist first
      const existingPlatforms = await tx.platform.findMany({
        where: { id: { in: platforms } },
        select: { id: true },
      });

      if (existingPlatforms.length !== platforms.length) {
        throw new AppError(
          status.BAD_REQUEST,
          "One or more platforms not found",
        );
      }

      await tx.mediaPlatform.createMany({
        data: platforms.map((platformId: string) => ({
          mediaId: media.id,
          platformId,
        })),
      });
    }

    // 4. Create cast members
    if (cast?.length > 0) {
      await tx.castMember.createMany({
        data: cast.map(
          (member: { name: string; role: string; image?: string }) => ({
            mediaId: media.id,
            name: member.name,
            role: member.role,
            image: member.image || null,
          }),
        ),
      });
    }

    // 5. Return media with all relations
    return tx.media.findUniqueOrThrow({
      where: { id: media.id },
      include: {
        genres: true,
        platforms: { include: { platform: true } },
        cast: true,
      },
    });
  });

  return result;
};
const updateMedia = async (id: string, user: IRequestUser, payload: any) => {
  const {
    genres,
    platforms,
    cast,
    slug,
    releaseYear,
    runtimeMinutes,
    seasons,
    ...mediaData
  } = payload;

  await prisma.media.findUniqueOrThrow({ where: { id } });

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update base media fields
    const media = await tx.media.update({
      where: { id },
      data: {
        ...mediaData,
        ...(slug && {
          slug: slug
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, ""),
        }),
        ...(releaseYear && { releaseYear: Number(releaseYear) }),
        runtimeMinutes: parseNullableNumber(runtimeMinutes),
        seasons: parseNullableNumber(seasons),
      },
    });

    // 2. Update genres
    if (genres !== undefined) {
      const genreIds = normalizeIds(genres);

      if (genreIds.length > 0) {
        const existingGenres = await tx.genre.findMany({
          where: { id: { in: genreIds } },
          select: { id: true },
        });
        if (existingGenres.length !== genreIds.length) {
          throw new AppError(
            status.BAD_REQUEST,
            "One or more genres not found",
          );
        }
      }

      await tx.media.update({
        where: { id: media.id },
        data: {
          genres: { set: genreIds.map((gid) => ({ id: gid })) },
        },
      });
    }

    // 3. Update platforms
    if (platforms !== undefined) {
      const platformIds = normalizeIds(platforms);

      await tx.mediaPlatform.deleteMany({ where: { mediaId: media.id } });

      if (platformIds.length > 0) {
        const existingPlatforms = await tx.platform.findMany({
          where: { id: { in: platformIds } },
          select: { id: true },
        });
        if (existingPlatforms.length !== platformIds.length) {
          throw new AppError(
            status.BAD_REQUEST,
            "One or more platforms not found",
          );
        }
        await tx.mediaPlatform.createMany({
          data: platformIds.map((platformId) => ({
            mediaId: media.id,
            platformId,
          })),
        });
      }
    }

    // 4. Update cast
    if (cast !== undefined) {
      await tx.castMember.deleteMany({ where: { mediaId: media.id } });

      if (cast.length > 0) {
        await tx.castMember.createMany({
          data: cast.map(
            (member: { name: string; role: string; image?: string }) => ({
              mediaId: media.id,
              name: member.name,
              role: member.role,
              image: member.image || null,
            }),
          ),
        });
      }
    }

    // 5. Return updated media with all relations
    return tx.media.findUniqueOrThrow({
      where: { id: media.id },
      include: {
        genres: true,
        platforms: { include: { platform: true } },
        cast: true,
      },
    });
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
