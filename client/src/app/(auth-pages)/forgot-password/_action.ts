"use server";

import { axiosClient } from "@/lib/axiosClient";
import { ApiError } from "@/types/api.types";
import {
  IForgotPasswordProps,
  forgotPasswordZodSchema,
} from "@/zod/auth.validation";

export interface IForgotPasswordResponse {
  success: boolean;
  message: string;
}

export const forgotPasswordAction = async (
  payload: IForgotPasswordProps,
): Promise<IForgotPasswordResponse | ApiError> => {
  const parsedPayload = forgotPasswordZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Invalid field values.";
    return {
      success: false,
      message: firstError,
      error: parsedPayload.error,
    };
  }

  try {
    const res = await axiosClient.post<IForgotPasswordResponse>(
      "/auth/forgot-password",
      parsedPayload.data,
    );

    return {
      success: true,
      message: res.data.message || "Password reset link sent successfully.",
    };
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to send reset link. Please try again.",
    };
  }
};