"use server";
import { axiosClient } from "@/lib/axiosClient";
import { IProfileResponse } from "@/types/auth.types";
import { setTokenInCookie } from "@/utils/token-utils";
import { cookies } from "next/headers";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    const { data } = await res.json();

    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) {
      await setTokenInCookie("accessToken", accessToken);
    }

    if (newRefreshToken) {
      await setTokenInCookie("refreshToken", newRefreshToken);
    }

    if (token) {
      await setTokenInCookie("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
    }

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }
 
    const { data } = await res.json();

    return data as IProfileResponse;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
