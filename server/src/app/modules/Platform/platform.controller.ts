import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";
import status from "http-status";
import { PlatformService } from "./platform.service";

const createPlatform = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformService.createPlatform(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Platform created successfully",
    data: result,
  });
});

const getAllPlatforms = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  console.log("query from platfrom get all: ", query);

  const result = await PlatformService.getAllPlatforms(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Platforms fetched successfully",
    data: result,
  });
});

const deletePlatform = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PlatformService.deletePlatform(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Platform deleted successfully",
    data: result,
  });
});

const updatePlatform = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PlatformService.updatePlatform(id as string, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Platform updated successfully",
    data: result,
  });
});


const createManyPlatfrom = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await PlatformService.createManyPlatfrom(data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All Platforms created successfully",
    data: result,
  });
});

export const PlatformController = {
  createPlatform,
  getAllPlatforms,
  updatePlatform,
  deletePlatform,
  createManyPlatfrom,
};
