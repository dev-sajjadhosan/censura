"use server";
import { axiosClient } from "@/lib/axiosClient";
import { ApiResponse, ApiResult } from "@/types/api.types";
import { Media } from "@/types/media.types";

export const getAllMedia = async (params?: any) => {
  return await axiosClient.get<ApiResult<Media[]>>("/media", { params });
};

export const getMediaBySlug = async (slug: string) => {
  return await axiosClient.get<Media>(`/media/slug/${slug}`);
};

export const getMediaReviews = async (mediaId: string) => {
  return await axiosClient.get(`/reviews/media/${mediaId}`);
};

export const createReview = async (payload: any) => {
  return await axiosClient.post("/reviews", payload);
};

export const purchaseMedia = async (payload: any) => {
  return await axiosClient.post("/payments/purchase-media", payload);
};

export const getMyMediaPurchases = async () => {
  return await axiosClient.get("/payments/my-media-purchases");
};
