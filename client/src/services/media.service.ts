"use server";
import { axiosClient } from "@/lib/axiosClient";

export const getAllMedia = async (params?: any) => {
  return await axiosClient.get("/media", { params });
};

export const getMediaBySlug = async (slug: string) => {
  return await axiosClient.get(`/media/slug/${slug}`);
};

export const getMediaReviews = async (mediaId: string) => {
  return await axiosClient.get(`/reviews/media/${mediaId}`);
};

export const addToWatchlist = async (mediaId: string) => {
  return await axiosClient.post(`/watchlist/${mediaId}`, {});
};

export const removeFromWatchlist = async (mediaId: string) => {
  return await axiosClient.delete(`/watchlist/${mediaId}`);
};

export const getMyWatchlist = async () => {
  return await axiosClient.get("/watchlist");
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
