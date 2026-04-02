"use server";

import { axiosClient } from "@/lib/axiosClient";
import { ApiResponse, ApiResult } from "@/types/api.types";
import { Media, MediaPurchase } from "@/types/media.types";
import { revalidateTag } from "next/cache";

// ─── Media Fetching ───────────────────────────────────────────
export const getAllMedia = async (params?: any) => {
  const res = await axiosClient.get<Media[]>("/media", { params });
  return res;
};

export const getMediaBySlug = async (slug: string) => {
  const res = await axiosClient.get<Media>(`/media/slug/${slug}`);
  return res;
};

export const getMediaById = async (id: string) => {
  const res = await axiosClient.get<Media>(`/media/${id}`);
  return res;
};

// ─── Purchases ────────────────────────────────────────────────
export const purchaseMedia = async (payload: any) => {
  const res = await axiosClient.post("/payments/purchase-media", payload);
  // Revalidate media and purchases since ownership state has changed
  revalidateTag("media", "");
  revalidateTag("purchases", "");
  return res;
};

export const getMyMediaPurchases = async () => {
  const res = await axiosClient.get<MediaPurchase[]>("/payments/my-media-purchases");
  return res;
};

// ─── Reviews ──────────────────────────────────────────────────
export const getMediaReviews = async (mediaId: string) => {
  const res = await axiosClient.get(`/reviews/media/${mediaId}`);
  return res;
};

export const createReview = async (payload: any) => {
  const res = await axiosClient.post("/reviews", payload);
  revalidateTag("reviews", "");
  return res;
};

export const updateReview = async (id: string, payload: any) => {
  const res = await axiosClient.patch(`/reviews/${id}`, payload);
  revalidateTag("reviews", "");
  return res;
};

export const deleteReview = async (id: string) => {
  const res = await axiosClient.delete(`/reviews/${id}`);
  revalidateTag("reviews", "");
  return res;
};