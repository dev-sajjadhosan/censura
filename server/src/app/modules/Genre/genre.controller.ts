import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendRes";
import status from "http-status";
import { GenreService } from "./genre.service";

const createGenre = catchAsync(async (req: Request, res: Response) => {
  const result = await GenreService.createGenre(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Genre created successfully",
    data: result,
  });
});

const getAllGenres = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  console.log("query from genre get all: ", query);

  const result = await GenreService.getAllGenres(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Genres fetched successfully",
    data: result,
  });
});

const deleteGenre = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GenreService.deleteGenre(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Genre deleted successfully",
    data: result,
  });
});

const updateGenre = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GenreService.updateGenre(id as string, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Genre updated successfully",
    data: result,
  });
});

const createManyGenre = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await GenreService.createManyGenre(data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All Genres created successfully",
    data: result,
  });
});

export const GenreController = {
  createGenre,
  getAllGenres,
  updateGenre,
  deleteGenre,
  createManyGenre,
};
