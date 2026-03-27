import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";
import status from "http-status";
import { PaymentService } from "./payment.service";
import { IRequestUser } from "../../interfaces";

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyPayments(req.user as IRequestUser);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment history fetched successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result,
  });
});

const getMyMediaPurchases = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyMediaPurchases(req.user as IRequestUser);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Media purchase history fetched successfully",
    data: result,
  });
});

const createMediaPurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createMediaPurchase(
    req.user as IRequestUser,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Media purchased successfully",
    data: result,
  });
});

export const PaymentController = {
  getMyPayments,
  getAllPayments,
  getMyMediaPurchases,
  createMediaPurchase,
};
