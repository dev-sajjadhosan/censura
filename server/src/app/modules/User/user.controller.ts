import { Request, Response } from "express";
import { UserService } from "./user.service";
import { sendResponse } from "../../shared/sendRes";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateProfile(
    req.user?.userId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUser(req.params.id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.changeStatus(
    req.params.id as string,
    req.body as any,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Status changed successfully",
    data: result,
  });
});

const toggleDeactivateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.toggleDeactivateUser(
    req.params.id as string,
    req.body as any,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Status changed successfully",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changeStatus,
  toggleDeactivateUser,
};
