"use server";
import { axiosClient } from "@/lib/axiosClient";
import { IProfileResponse } from "@/types/auth.types";
import { setTokenInCookie } from "@/utils/token-utils";
import { revalidateTag } from "next/cache";
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

    if (!res.ok) return false;

    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) await setTokenInCookie("accessToken", accessToken);
    if (newRefreshToken) await setTokenInCookie("refreshToken", newRefreshToken);
    if (token) await setTokenInCookie("better-auth.session_token", token, 24 * 60 * 60);

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

    if (!accessToken) return null;

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      next: {
        tags: ["user-profile"], 
      },
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    return data as IProfileResponse;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function chnagePassword(data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const res = await axiosClient.patch(`/auth/change-password`, data);
    const { accessToken, refreshToken, token } = res.data as any;

    if (accessToken) await setTokenInCookie("accessToken", accessToken);
    if (refreshToken) await setTokenInCookie("refreshToken", refreshToken);
    if (token) await setTokenInCookie("better-auth.session_token", token, 24 * 60 * 60);

   
    revalidateTag("user-profile", "");
    return res;
  } catch (err: any) {
    throw err;
  }
}

export async function updateProfile(data: Partial<IProfileResponse>) {
  try {
    const res = await axiosClient.patch(`/users/profile`, data);
    revalidateTag("user-profile", "");
    return res;
  } catch (err: any) {
    throw err;
  }
}

export async function deleteProfile(id: string) {
  try {
    const res = await axiosClient.patch(`/users/own/status/${id}`, {
      status: "DELETED",
    });
    
    revalidateTag("user-profile", "");
    return res;
  } catch (err: any) {
    throw err;
  }
}

export async function toggleDeactivateUser(id: string, payload: any) {
  try {
    const res = await axiosClient.patch(`/users/own/status/${id}`, payload);
    revalidateTag("user-profile", "");
    return res;
  } catch (err: any) {
    throw err;
  }
}

export async function subscribeToNewsletter(email: string) {
  try {
    const res = await fetch(`${BASE_API_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to subscribe");
    }

    return await res.json();
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }
}