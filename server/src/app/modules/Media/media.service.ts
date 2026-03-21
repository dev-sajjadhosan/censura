import status from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../../interfaces";

const getAllMedia = async (user: IRequestUser, query: any) => {
  const result = await prisma.media.findMany();
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

const createMedia = async (user: IRequestUser, payload: Prisma.MediaCreateInput) => {
  const result = await prisma.media.create({
    data: payload,
  });
  return result;
};

const updateMedia = async (id: string, user: IRequestUser, payload: Prisma.MediaUpdateInput) => {
  const result = await prisma.media.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteMedia = async (id: string) => {
  const result = await prisma.media.delete({
    where: {
      id,
    },
  });
  return result;
};

const changeEditorsPickStatus = async (
  id: string,
  payload: { isEditorsPick: boolean },
) => {
  const media = await prisma.media.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (media.isEditorsPick === payload.isEditorsPick) {
    throw new AppError(status.BAD_REQUEST, "Media is already an editor's pick");
  }
  const result = await prisma.media.update({
    where: {
      id,
    },
    data: {
      isEditorsPick: payload.isEditorsPick,
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


export const MediaService = {
  getAllMedia,
  getSingleMedia,
  createMedia,
  updateMedia,
  deleteMedia,
  changeEditorsPickStatus,
  changePublishStatus,
};
