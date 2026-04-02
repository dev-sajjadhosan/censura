import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendRes";
import { BookmarkService } from "./bookmark.service";
import { IRequestUser } from "../../interfaces";

const getAllBookmark = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const query = req.query;

  const result = await BookmarkService.getAllBookmark(user, query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bookmark fetched successfully",
    data: result,
  });
});

const createBookmark = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await BookmarkService.createBookmark({ mediaId }, user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bookmark created successfully",
    data: result,
  });
});

const deleteBookmark = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await BookmarkService.deleteBookmark(mediaId as string, user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bookmark deleted successfully",
    data: result,
  });
});

export const BookmarkController = {
  getAllBookmark,
  createBookmark,
  deleteBookmark,
};
