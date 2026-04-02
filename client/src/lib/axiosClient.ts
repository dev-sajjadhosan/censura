import { ApiRequestOptions, ApiResponse } from "@/types/api.types";
import axios, { AxiosError, AxiosInstance } from "axios";
import { cookies } from "next/headers";
import { getNewTokensWithRefreshToken } from "@/services/user.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const getBaseInstance = async (): Promise<AxiosInstance> => {
  const cookieStore = await cookies();
  const cookieHeaders = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeaders,
    },
  });
};

const handleRequest = async <TData>(
  requestFn: (instance: AxiosInstance) => Promise<{ data: ApiResponse<TData> }>,
  endPath: string,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await getBaseInstance();
    const response = await requestFn(instance);
    return response.data;
  } catch (err: any) {
    const axiosError = err as AxiosError<ApiResponse<any>>;
    const errorData = axiosError.response?.data;

    console.error(`[API Error] ${endPath}:`, errorData || axiosError.message);

    // Check for 401 status
    if (axiosError.response?.status === 401) {
      const cookieStore = await cookies();

      // CRITICAL: If the account is deactivated/inactive, clear cookies and stop
      const errorMessage = errorData?.message?.toLowerCase() || "";
      if (
        errorMessage.includes("not active") ||
        errorMessage.includes("deactivated")
      ) {
        console.warn("User inactive. Clearing session cookies.");
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("better-auth.session_token"); // If using Better-Auth
        throw errorData;
      }

      // Otherwise, try standard refresh logic
      const refreshToken = cookieStore.get("refreshToken")?.value;
      if (refreshToken) {
        try {
          const refreshed = await getNewTokensWithRefreshToken(refreshToken);
          if (refreshed) {
            const newInstance = await getBaseInstance();
            const retryResponse = await requestFn(newInstance);
            return retryResponse.data;
          }
        } catch (refreshErr) {
          // If refresh fails, clear everything
          cookieStore.delete("accessToken");
          cookieStore.delete("refreshToken");
        }
      }
    }

    throw errorData || axiosError;
  }
};

export const axiosClient = {
  get: async <TData>(url: string, options?: ApiRequestOptions) =>
    handleRequest<TData>((i) => i.get(url, options), url),

  post: async <TData>(
    url: string,
    data: unknown,
    options?: ApiRequestOptions,
  ) => handleRequest<TData>((i) => i.post(url, data, options), url),

  put: async <TData>(url: string, data: unknown, options?: ApiRequestOptions) =>
    handleRequest<TData>((i) => i.put(url, data, options), url),

  patch: async <TData>(
    url: string,
    data: unknown,
    options?: ApiRequestOptions,
  ) => handleRequest<TData>((i) => i.patch(url, data, options), url),

  delete: async <TData>(url: string, options?: ApiRequestOptions) =>
    handleRequest<TData>((i) => i.delete(url, options), url),
};
