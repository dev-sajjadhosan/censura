"use server"

import { axiosClient } from "@/lib/axiosClient";

export const createMediaCheckoutSession = async (payload: {
  mediaId: string;
  type: "RENTAL" | "BUY";
}) => {
  const res = await axiosClient.post("/payments/media-checkout", payload);
  return res;
};