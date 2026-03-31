"use server";
import { axiosClient } from "@/lib/axiosClient";
import { SubscriptionPlan } from "@/types/payment.types";

export const getSubscriptionPlans = async () => {
  return await axiosClient.get<SubscriptionPlan[]>("/subscriptions/plans");
};

export const createCheckoutSession = async (payload: any) => {
  return await axiosClient.post("/subscriptions/checkout", payload);
};

export const getSubscriptionStatus = async () => {
  return await axiosClient.get("/subscriptions/status");
};

export const getPaymentHistory = async () => {
  return await axiosClient.get("/subscriptions/history");
};

export const cancelSubscription = async () => {
  const res = await axiosClient.delete("/subscriptions/cancel");
  return res;
};