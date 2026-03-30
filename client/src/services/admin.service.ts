"use server";
import { axiosClient } from "@/lib/axiosClient";
import { ApiResult } from "@/types/api.types";
import { Genre, Platform } from "@/types/media.types";

export const adminCreateMediaBulk = async (payload: any) => {
  return await axiosClient.post("/media/bulk", payload);
};

export const adminCreateGenreBulk = async (paylaod:any) => {
  return await axiosClient.post("/genres/bulk", paylaod)
}

export const adminCreatePlatformBulk = async (payload:any) => {
  return await axiosClient.post("/platforms/bulk", payload)
}

// ─── Media CRUD ────────────────────────────────────────────────
export const adminGetAllMedia = async (params?: any) => {
  return await axiosClient.get<any[]>("/media", { params });
};

export const adminGetMediaById = async (id: string) => {
  return await axiosClient.get(`/media/${id}`);
};

export const adminCreateMedia = async (payload: any) => {
  return await axiosClient.post("/media", payload);
};

export const adminUpdateMedia = async (id: string, payload: any) => {
  return await axiosClient.patch(`/media/${id}`, payload);
};

export const adminDeleteMedia = async (id: string) => {
  return await axiosClient.delete(`/media/${id}`);
};

export const adminToggleMediaPublish = async (
  id: string,
  isPublished: boolean,
) => {
  return await axiosClient.patch(`/media/${id}`, { isPublished });
};

// ─── Review Moderation ─────────────────────────────────────────
export const adminGetAllReviews = async (params?: any) => {
  return await axiosClient.get<any[]>("/reviews", { params });
};

export const adminUpdateReviewStatus = async (
  id: string,
  status: "APPROVED" | "UNPUBLISHED" | "PENDING",
) => {
  return await axiosClient.patch(`/reviews/${id}/status`, { status });
};

export const adminDeleteReview = async (id: string) => {
  return await axiosClient.delete(`/reviews/${id}`);
};

// ─── User Management ──────────────────────────────────────────
export const adminGetAllUsers = async (params?: any) => {
  return await axiosClient.get<any[]>("/users", { params });
};

export const adminUpdateUserStatus = async (
  id: string,
  status: "ACTIVE" | "BLOCKED",
) => {
  return await axiosClient.patch(`/users/${id}/status`, { status });
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
  return await axiosClient.post("/genres", payload);
};

export const adminUpdateGenre = async (id: string, payload: any) => {
  return await axiosClient.patch(`/genres/${id}`, payload);
};

export const adminDeleteGenre = async (id: string) => {
  return await axiosClient.delete(`/genres/${id}`);
};

// ─── Platform Management ──────────────────────────────────────
export const getAllPlatforms = async (params?: any) => {
  return await axiosClient.get<ApiResult<Platform[]>>("/platforms", { params });
};

export const adminCreatePlatform = async (payload: any) => {
  return await axiosClient.post("/platforms", payload);
};

export const adminUpdatePlatform = async (id: string, payload: any) => {
  return await axiosClient.patch(`/platforms/${id}`, payload);
};

export const adminDeletePlatform = async (id: string) => {
  return await axiosClient.delete(`/platforms/${id}`);
};
