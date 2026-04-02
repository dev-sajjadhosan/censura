"use server";

import { axiosClient } from "@/lib/axiosClient";
import { revalidateTag } from "next/cache";

// ─── Watchlist ────────────────────────────────────────────────
export const getMyWatchlist = async () => {
  const res = await axiosClient.get("/watchlist");
  return res;
};

export const addToWatchlist = async (mediaId: string) => {
  const res = await axiosClient.post(`/watchlist/${mediaId}`, {});
  // Adding the second argument to satisfy the "2 arguments" requirement
  revalidateTag("watchlist", ""); 
  return res;
};

export const removeFromWatchlist = async (mediaId: string) => {
  const res = await axiosClient.delete(`/watchlist/${mediaId}`);
  revalidateTag("watchlist", "");
  return res;
};

// ─── Bookmarks ────────────────────────────────────────────────
export const getBookmarked = async () => {
  const res = await axiosClient.get("/bookmarks");
  return res;
};

export const addToBookmark = async (reviewId: string) => {
  const res = await axiosClient.post(`/bookmarks/${reviewId}`, {});
  revalidateTag("bookmarks", "");
  return res;
};

export const removeFromBookmark = async (reviewId: string) => {
  const res = await axiosClient.delete(`/bookmarks/${reviewId}`);
  revalidateTag("bookmarks", "");
  return res;
};

// ─── Favorites ────────────────────────────────────────────────
export const getMyFavorites = async () => {
  const res = await axiosClient.get("/favorites");
  return res;
};

export const addToFavorite = async (mediaId: string) => {
  const res = await axiosClient.post(`/favorites/${mediaId}`, {});
  revalidateTag("favorites", "");
  return res;
};

export const removeFromFavorite = async (mediaId: string) => {
  const res = await axiosClient.delete(`/favorites/${mediaId}`);
  revalidateTag("favorites", "");
  return res;
};