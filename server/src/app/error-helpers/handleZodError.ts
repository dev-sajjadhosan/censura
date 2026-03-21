import z from "zod";
import { TErrorSources } from "../interfaces/error.interface";
import status from "http-status";

export const handleZodError = (err: z.ZodError) => {
  let statusCode: number = status.BAD_REQUEST;
  let message: string = "Zod validation error.";
  let errorSources: TErrorSources[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path:
        issue.path.length > 1
          ? issue.path.join(" => ")
          : issue.path[0].toString(),
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSources,
    statusCode,
  };
};
