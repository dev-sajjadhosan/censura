import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";
import { MediaService } from "./media.service";
import { IRequestUser } from "../../interfaces";
import status from "http-status";

const getAllMedia = catchAsync(async (req, res) => {
  const user = req.user as IRequestUser;
  const query = req.query;

  const result = await MediaService.getAllMedia(user, query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media fetched successfully",
    data: result,
  });
});

const getSingleMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.getSingleMedia(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media fetched successfully",
    data: result,
  });
});

const getMediaBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await MediaService.getMediaBySlug(slug as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media fetched successfully",
    data: result,
  });
});

const createMedia = catchAsync(async (req, res) => {
  const user = req.user as IRequestUser;
  const data = req.body
  const result = await MediaService.createMedia(user, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media created successfully",
    data: result,
  });
});

const updateMedia = catchAsync(async (req, res) => {
  const user = req.user as IRequestUser;
  const { id } = req.params;
  const data = req.body;

  const result = await MediaService.updateMedia(id as string, user, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media updated successfully",
    data: result,
  });
});

const deleteMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.deleteMedia(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media deleted successfully",
    data: result,
  });
});

const changeFeaturedStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await MediaService.changeFeaturedStatus(id as string, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media editors pick status changed successfully",
    data: result,
  });
});

const changePublishStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await MediaService.changePublishStatus(id as string, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media publish status changed successfully",
    data: result,
  });
});

export const MediaController = {
  getAllMedia,
  getSingleMedia,
  getMediaBySlug,
  createMedia,
  updateMedia,
  deleteMedia,
  changeFeaturedStatus,
  changePublishStatus,
};
