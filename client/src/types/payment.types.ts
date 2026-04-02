import { User } from "./auth.types";
import { Media, MediaPurchase, Rental } from "./media.types";

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  stripePaymentId: string;
  status: string;

  createdAt: string;
  rentalId: string;

  user: User;
  rental: Rental;
  subscription: Subscription;
  mediaPurchase: MediaPurchase;
}

export interface Subscription {
  id: string;
  userId: string;
  user: User;
  plan: string;
  status: string;
  stripeCustomerId: string;
  stripePriceId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;

  payments: Payment[];
}

export interface SubscriptionPlan {
  name: string;
  price: number;
  badge: string | null;
  features: string[];
}
