"use server";

import { axiosClient } from "@/lib/axiosClient";
import { IVerifyEmailProps, verifyEmailZodSchema } from "@/zod/auth.validation";

export const verifyEmailAction = async (payload: IVerifyEmailProps) => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Invalid field values.";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const res = await axiosClient.post("/auth/verify-email", payload);
    console.log("verify Email Action", res.data);
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to verify email.",
    };
  }
};
