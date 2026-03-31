"use server"

import { axiosClient } from "@/lib/axiosClient";

export const addToWatchlist = async (mediaId: string) => {
  return await axiosClient.post(`/watchlist/${mediaId}`, {});
};

export const removeFromWatchlist = async (mediaId: string) => {
  return await axiosClient.delete(`/watchlist/${mediaId}`);
};

export const getMyWatchlist = async () => {
  return await axiosClient.get("/watchlist");
};

export const getBookmarked = async () => {
  return await axiosClient.get("/bookmarks");
};

export const addToBookmark = async (reviewId: string) => {
  return await axiosClient.post(`/bookmarks/${reviewId}`, {});
};

export const removeFromBookmark = async (reviewId: string) => {
  return await axiosClient.delete(`/bookmarks/${reviewId}`);
};

export const getMyFavorites = async () => {
  return await axiosClient.get("/favorites");
};

export const addToFavorite = async (mediaId: string) => {
  return await axiosClient.post(`/favorites/${mediaId}`, {});
};

export const removeFromFavorite = async (mediaId: string) => {
  return await axiosClient.delete(`/favorites/${mediaId}`);
};
