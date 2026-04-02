"use server";
import { axiosClient } from "@/lib/axiosClient";
import { deleteCookie } from "@/utils/cookie-utils";
import { cookies } from "next/headers";

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    await axiosClient.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    );

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");

    return { success: true };
  } catch (error: any) {
    console.error("Logout Error:", error.response?.data || error.message);
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");

    return { success: false, error: error.message };
  }
}
