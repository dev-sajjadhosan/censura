"use server";

import { axiosClient } from "@/lib/axiosClient";
import { Payment } from "@/types/payment.types";
import { revalidateTag } from "next/cache";

// ─── Checkout ────────────────────────────────────────────────
export const createMediaCheckoutSession = async (payload: {
  mediaId: string;
  type: "RENTAL" | "BUY";
}) => {
  const res = await axiosClient.post("/payments/media-checkout", payload);

  revalidateTag("purchases", "");
  revalidateTag("payments", "");
  
  return res;
};

// ─── Purchases ────────────────────────────────────────────────
export const getMyMediaPurchases = async () => {
  try {
    const res = await axiosClient.get("/payments/my-media-purchases");
    return res;
  } catch (err: any) {
    console.error("Error fetching purchases:", err);
    throw err; 
  }
};

// ─── Payment History ──────────────────────────────────────────
export const getMyPayments = async () => {
  try {
    const res = await axiosClient.get<Payment[]>("/payments/my-payments");
    return res;
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};