import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";
import { FavoriteService } from "./favourite.service";
import { IRequestUser } from "../../interfaces";

const getAllFavourite = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const query = req.query;

  const result = await FavoriteService.getAllFavourite(user, query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Favourite fetched successfully",
    data: result,
  });
});

const createFavourite = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await FavoriteService.createFavourite({ mediaId }, user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Favourite created successfully",
    data: result,
  });
});

const deleteFavourite = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await FavoriteService.deleteFavourite(mediaId as string, user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Favourite deleted successfully",
    data: result,
  });
});

export const FavoriteController = {
  getAllFavourite,
  createFavourite,
  deleteFavourite,
};
