import { Response } from "express";

export interface IResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  responseData: IResponseData<T>,
) => {
  const { statusCode, message, success, data, meta } = responseData;

  res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};
