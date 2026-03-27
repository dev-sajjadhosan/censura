"use server";
import { axiosClient } from "@/lib/axiosClient";
import { deleteCookie } from "@/utils/cookie-utils";

export async function logoutAction() {
  try {
    const res = await axiosClient.get("/auth/logout");
    console.log("logout action", res);
    if (res.success) {
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      await deleteCookie("better-auth.session_token");
      await deleteCookie("__next_hmr_refresh_hash__");
    }
  } catch (error: any) {
    throw error.message;
  }
}
