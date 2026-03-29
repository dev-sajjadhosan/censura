"use server";

import { axiosClient } from "@/lib/axiosClient";
import { ApiError } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import {
  getDefaultRoute,
  isValidRedicrectForRole,
  Role,
} from "@/utils/auth-client";
import { setTokenInCookie } from "@/utils/token-utils";
import { ILoginProps, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

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
    const res = await axiosClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    // console.log("Login action response---------------------: ", res);

    const { accessToken, refreshToken, token, user } = res.data;

    const { role, emailVerified, needPasswordChange, email } = user;

    await setTokenInCookie("accessToken", accessToken);
    await setTokenInCookie("refreshToken", refreshToken);
    await setTokenInCookie(
      "better-auth.session_token",
      token,
      24 * 60 * 60 * 1000,
    ); // 1 day

    if (needPasswordChange) {
      redirect(`/reset-password?email=${email}&redirectPath=${redirectPath}`);
    } else {
      const targetPath =
        redirectPath && isValidRedicrectForRole(redirectPath, role as Role)
          ? redirectPath
          : getDefaultRoute(role as Role);

      redirect(targetPath);
    }
  } catch (error: any) {
    // console.log(`Login action error----------:`, error.message);
    if (
      (error && error.message === "Email not verified") ||
      error.message === "User not verified. Again send verification email."
    ) {
      return redirect(`/verify-email?email=${parsedPayload.data.email}`);
    }
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
      message: `Login failed: ${error.message}`,
    };
  }
};
