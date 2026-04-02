import catchAsync from "../../shared/catchAsync";
import { getAllMedia as getAllMediaService, getSingleMedia as getSingleMediaService, getMediaBySlug as getMediaBySlugService, createMedia as createMediaService, updateMedia as updateMediaService, deleteMedia as deleteMediaService, changeFeaturedStatus as changeFeaturedStatusService, changePublishStatus as changePublishStatusService, createManyMedia as createManyMediaService } from "./media.service";
import { IRequestUser } from "../../interfaces";
import status from "http-status";
import { sendResponse } from "../../shared/sendRes";

export const getAllMedia = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await getAllMediaService(query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const getSingleMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleMediaService(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media fetched successfully",
    data: result,
  });
});

export const getMediaBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await getMediaBySlugService(slug as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media fetched by slug successfully",
    data: result,
  });
});

export const createMedia = catchAsync(async (req, res) => {
  const user = req.user as IRequestUser;
  const data = req.body;
  const result = await createMediaService(user, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media created successfully",
    data: result,
  });
});

export const updateMedia = catchAsync(async (req, res) => {
  const user = req.user as IRequestUser;
  const { id } = req.params;
  const data = req.body;

  const result = await updateMediaService(id as string, user, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media updated successfully",
    data: result,
  });
});

export const deleteMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteMediaService(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media deleted successfully",
    data: result,
  });
});

export const changeFeaturedStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await changeFeaturedStatusService(id as string, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media editors pick status changed successfully",
    data: result,
  });
});

export const changePublishStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await changePublishStatusService(id as string, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media publish status changed successfully",
    data: result,
  });
});

export const createManyMedia = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await createManyMediaService(data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All Media created successfully",
    data: result,
  });
});
