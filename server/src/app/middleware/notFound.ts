import { Request, Response } from "express";
import status from "http-status";

export const notFound = (req: Request, res: Response) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    statusCode: status.NOT_FOUND,
    message: "Route not match or don't exist. Please check the path again.",
    errorSources: [
      {
        path: req.originalUrl,
        message: "Route not match or don't exist. Please check the path again.",
      },
    ],
  });
};
