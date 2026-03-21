import { Request, Response } from "express";
import { IRequestUser } from "../../../interfaces";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";
import { LikesService } from "./reaction.service";
import status from "http-status";


const createLike = catchAsync(async (req: Request, res: Response) => {
    const result = await LikesService.createReviewLike(req.user as IRequestUser, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Like created successfully",
        data: result,
    });
});

const deleteLike = catchAsync(async (req: Request, res: Response) => {
    const result = await LikesService.deleteReviewLike(req.params.id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Like deleted successfully",
        data: result,
    });
});

export const ReactionController = {
    createLike,
    deleteLike,
};