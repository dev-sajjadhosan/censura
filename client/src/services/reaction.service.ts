"use server";
import { axiosClient } from "@/lib/axiosClient";
import { Like } from "@/types/reaction.types";

export const createLike = async (payload: Like) => {
  return await axiosClient.post("/reactions", payload);
};

export const deleteLike = async (id: string, payload: Like) => {
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


export const getComments = async (reviewId: string) => {
  try {
    const res = await axiosClient.get<Comment[]>(`/reactions/comment/${reviewId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
