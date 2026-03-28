"use server";
import { axiosClient } from "@/lib/axiosClient";

// ─── Media CRUD ────────────────────────────────────────────────
export const adminGetAllMedia = async (params?: any) => {
  return await axiosClient.get<any[]>("/admin/media", { params });
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
  return await axiosClient.get("/analytics/stats");
};

export const adminGetSalesAnalytics = async (params?: any) => {
  return await axiosClient.get("/analytics/sales", { params });
};

export const adminGetReviewAnalytics = async () => {
  return await axiosClient.get("/analytics/reviews");
};
