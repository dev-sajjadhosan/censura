"use server";

import { axiosClient } from "@/lib/axiosClient";
import { ApiResult } from "@/types/api.types";
import { Genre, Platform } from "@/types/media.types";
import { revalidateTag } from "next/cache";

// ─── Bulk Operations ──────────────────────────────────────────
export const adminCreateMediaBulk = async (payload: any) => {
  const res = await axiosClient.post("/media/bulk", payload);
  revalidateTag("media", "");
  return res;
};

export const adminCreateGenreBulk = async (payload: any) => {
  const res = await axiosClient.post("/genres/bulk", payload);
  revalidateTag("genres", "");
  return res;
};

export const adminCreatePlatformBulk = async (payload: any) => {
  const res = await axiosClient.post("/platforms/bulk", payload);
  revalidateTag("platforms", "");
  return res;
};

// ─── Media CRUD ────────────────────────────────────────────────
export const adminGetAllMedia = async (params?: any) => {
  return await axiosClient.get<any[]>("/media", { params });
};

export const adminGetMediaById = async (id: string) => {
  return await axiosClient.get(`/media/${id}`);
};

export const adminCreateMedia = async (payload: any) => {
  const res = await axiosClient.post("/media", payload);
  revalidateTag("media", "");
  return res;
};

export const adminUpdateMedia = async (id: string, payload: any) => {
  const res = await axiosClient.patch(`/media/${id}`, payload);
  revalidateTag("media", "");
  return res;
};

export const adminDeleteMedia = async (id: string) => {
  const res = await axiosClient.delete(`/media/${id}`);
  revalidateTag("media", "");
  return res;
};

export const adminToggleMediaPublish = async (
  id: string,
  isPublished: boolean,
) => {
  const res = await axiosClient.patch(`/media/${id}`, { isPublished });
  revalidateTag("media", "");
  return res;
};

// ─── Review Moderation ─────────────────────────────────────────
export const adminGetAllReviews = async (params?: any) => {
  return await axiosClient.get<any[]>("/reviews/admin", { params });
};

export const adminUpdateReviewStatus = async (
  id: string,
  status: "APPROVED" | "UNPUBLISHED" | "PENDING",
) => {
  const res = await axiosClient.patch(`/reviews/admin/status/${id}`, {
    status,
  });
  revalidateTag("reviews", "");
  return res;
};

export const adminDeleteReview = async (id: string) => {
  const res = await axiosClient.delete(`/reviews/admin/delete/${id}`);
  revalidateTag("reviews", "");
  return res;
};

// ─── User Management ──────────────────────────────────────────
export const adminGetAllUsers = async (params?: any) => {
  return await axiosClient.get<any[]>("/users", { params });
};

export const adminUpdateUserStatus = async (
  id: string,
  status: "ACTIVE" | "BLOCKED",
) => {
  const res = await axiosClient.patch(`/users/${id}/status`, { status });
  revalidateTag("users", "");
  return res;
};

// ─── Analytics / Dashboard ────────────────────────────────────
export const adminGetDashboardStats = async () => {
  return await axiosClient.get("/admin/analytics/stats");
};

export const adminGetSalesAnalytics = async (params?: any) => {
  return await axiosClient.get("/admin/analytics/sales", { params });
};

export const adminGetReviewAnalytics = async () => {
  return await axiosClient.get("/admin/analytics/reviews");
};

// ─── Genre Management ─────────────────────────────────────────
export const getAllGenres = async (params?: any) => {
  return await axiosClient.get<ApiResult<Genre[]>>("/genres", { params });
};

export const adminCreateGenre = async (payload: any) => {
  const res = await axiosClient.post("/genres", payload);
  revalidateTag("genres", "");
  return res;
};

export const adminUpdateGenre = async (id: string, payload: any) => {
  const res = await axiosClient.patch(`/genres/${id}`, payload);
  revalidateTag("genres", "");
  return res;
};

export const adminDeleteGenre = async (id: string) => {
  const res = await axiosClient.delete(`/genres/${id}`);
  revalidateTag("genres", "");
  return res;
};

// ─── Platform Management ──────────────────────────────────────
export const getAllPlatforms = async (params?: any) => {
  return await axiosClient.get<ApiResult<Platform[]>>("/platforms", { params });
};

export const adminCreatePlatform = async (payload: any) => {
  const res = await axiosClient.post("/platforms", payload);
  revalidateTag("platforms", "");
  return res;
};

export const adminUpdatePlatform = async (id: string, payload: any) => {
  const res = await axiosClient.patch(`/platforms/${id}`, payload);
  revalidateTag("platforms", "");
  return res;
};

export const adminDeletePlatform = async (id: string) => {
  const res = await axiosClient.delete(`/platforms/${id}`);
  revalidateTag("platforms", "");
  return res;
};
