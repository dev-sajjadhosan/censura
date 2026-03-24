import { ApiRequestOptions, ApiResponse } from "@/types/api.types";
import axios from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

async function tryRefreshToken(
  accessToken: string,
  refreshToken: string,
): Promise<void> {}

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken, refreshToken);
  }

  const cookieHeaders = await cookieStore
    .getAll()
    .map((cookie: any) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeaders,
    },
    withCredentials: true,
  });
  return instance;
};

const httpGet = async <TData>(
  endPath: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endPath, options);
    return response.data;
  } catch (err: any) {
    console.error(`HTTP GET Error: ${endPath}`, err);
    throw err;
  }
};

const httpPost = async <TData>(
  endPath: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(
      endPath,
      data,
      options,
    );
    return response.data;
  } catch (err: any) {
    console.error(`HTTP POST Error: ${endPath}`, err);
    throw err.response.data;
  }
};

const httpPut = async <TData>(
  endPath: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(
      endPath,
      data,
      options,
    );
    return response.data;
  } catch (err: any) {
    console.error(`HTTP PUT Error: ${endPath}`, err);
    throw err;
  }
};

const httpPatch = async <TData>(
  endPath: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(
      endPath,
      data,
      options,
    );
    return response.data;
  } catch (err: any) {
    console.error(`HTTP PATCH Error: ${endPath}`, err);
    throw err;
  }
};

const httpDelete = async <TData>(
  endPath: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(
      endPath,
      options,
    );
    return response.data;
  } catch (err: any) {
    console.error(`HTTP DELETE Error: ${endPath}`, err);
    throw err;
  }
};

export const axiosClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
