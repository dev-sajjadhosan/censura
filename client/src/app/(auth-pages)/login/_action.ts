"use server";

import { ApiError } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginProps, loginZodSchema } from "@/zod/auth.validation";

export const loginAction = async (
  payload: ILoginProps,
  redirectPath?: string,
): Promise<ILoginResponse | ApiError> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

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
    return {};
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while logging in.",
      error: error,
    };
  }
};
