"use server";
import { axiosClient } from "@/lib/axiosClient";
import { Like } from "@/types/reaction.types";

export const createLike = async (payload: {
  reviewId: string;
  mediaId: string;
  likeType: string;
}) => {
  return await axiosClient.post("/reactions", payload);
};

export const deleteLike = async (
  id: string,
  payload: { reviewId: string; mediaId: string; likeType: string },
) => {
  return await axiosClient.delete(`/reactions/${id}`, { data: payload } as any);
};

export const addComment = async (payload: Like) => {
  try {
    const res = await axiosClient.post("/reactions/comment", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
