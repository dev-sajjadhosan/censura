"use server";

import { axiosClient } from "@/lib/axiosClient";
import { SubscriptionPlan } from "@/types/payment.types";
import { revalidateTag } from "next/cache";

export const getSubscriptionPlans = async () => {
  try {
    const res = await axiosClient.get<SubscriptionPlan[]>("/subscriptions/plans");
    return res;
  } catch (err) {
    console.error("Backend unreachable:", err);
    return {
      data: [],
      success: false,
      message: "Server is currently offline.",
    };
  }
};


export const getSubscriptionStatus = async () => {
  const res = await axiosClient.get("/subscriptions/status");
  return res;
};

export const getPaymentHistory = async () => {
  const res = await axiosClient.get("/subscriptions/history");
  return res;
};


export const createCheckoutSession = async (payload: any) => {
  const res = await axiosClient.post("/subscriptions/checkout", payload);
  
 
  revalidateTag("subscriptions", "");
  return res;
};

export const cancelSubscription = async () => {
  const res = await axiosClient.delete("/subscriptions/cancel");
  
  revalidateTag("subscriptions", "");
  revalidateTag("payments", "");
  
  return res;
};