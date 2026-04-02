"use server";

import { axiosClient } from "@/lib/axiosClient";
import { Like, Comment } from "@/types/reaction.types";
import { revalidateTag } from "next/cache";


export const createLike = async (payload: Like) => {
  const res = await axiosClient.post("/reactions", payload);
  revalidateTag("reactions","");
  return res;
};

export const deleteLike = async (id: string, payload: Like) => {
  const res = await axiosClient.delete(`/reactions/${id}`, { data: payload } as any);
  revalidateTag("reactions","");
  return res;
};

export const getComments = async (reviewId: string) => {
  try {
    const res = await axiosClient.get<Comment[]>(`/reactions/comment/${reviewId}`);
    return res;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; 
  }
};

export const addComment = async (payload: Like) => {
  try {
    const res = await axiosClient.post("/reactions/comment", payload);
    
   
    revalidateTag("comments","");
    
    return res;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};