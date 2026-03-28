import { Request, Response } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin statistics retrieved successfully",
    data: result,
  });
});

const getSales = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSales();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin sales retrieved successfully",
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getReviews();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin reviews retrieved successfully",
    data: result,
  });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const { limit, sortBy, sortOrder } = req.query;
  const result = await AdminService.getAllMedia({
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin media retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  getStats,
  getSales,
  getReviews,
  getAllMedia,
};
