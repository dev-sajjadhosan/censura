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

export const AdminController = {
  getStats,
};
