"use server";

import { axiosClient } from "@/lib/axiosClient";
import { ApiError } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { setTokenInCookie } from "@/utils/token-utils";
import { IRegisterProps, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (
  payload: IRegisterProps,
) => {
  const parsedPayload = registerZodSchema.safeParse(payload);
  
  if (!parsedPayload.success) {
    const firstError =
    parsedPayload.error.issues[0].message || "invalid credentials";
    return {
      success: false,
      message: firstError,
    };
  }
  
  try {
    
    const res = await axiosClient.post<ILoginResponse>(
        "/auth/register",
        parsedPayload.data,
      );
      console.log("Register 000 Payload:", res);
      
    const { accessToken, refreshToken, token, user } = res.data;

    await setTokenInCookie("accessToken", accessToken);
    await setTokenInCookie("refreshToken", refreshToken);
    await setTokenInCookie("token", token);

    redirect(`/verify-email?email=${user.email}`);
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
      message: `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
