import { Request, Response } from "express";
import { IRequestUser } from "../../../interfaces";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";
import { LikesService } from "./reaction.service";
import status from "http-status";

const getAllComments = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const user = req.user as IRequestUser;
    const result = await LikesService.getAllComments(query, user);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Comments fetched successfully",
        data: result,
    });
});

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

const createComment = catchAsync(async (req: Request, res: Response) => {
    const result = await LikesService.createReviewComment(req.user as IRequestUser, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Comment created successfully",
        data: result,
    });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
    const result = await LikesService.deleteReviewComment(req.user as IRequestUser, req.params.id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Comment deleted successfully",
        data: result,
    });
});

const createCommentReply = catchAsync(async (req: Request, res: Response) => {
    const result = await LikesService.createCommentReply(req.user as IRequestUser, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Comment reply created successfully",
        data: result,
    });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
    const result = await LikesService.updateReviewComment(req.user as IRequestUser, req.params.id as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Comment updated successfully",
        data: result,
    });
});

const adminDeleteComment = catchAsync(async (req: Request, res: Response) => {
    const result = await LikesService.adminDeleteReviewComment(req.params.id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Comment deleted successfully",
        data: result,
    });
});

export const ReactionController = {
    getAllComments,
    createLike,
    deleteLike,
    createComment,
    deleteComment,
    createCommentReply,
    updateComment,
    adminDeleteComment,
};