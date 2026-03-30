import { Stripe } from "stripe";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../error-helpers/AppError";
import httpStatus from "http-status";
import { envVars } from "../../config/env";
import {
  MediaPurchaseStatus,
  MediaPurchaseType,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../../generated/prisma/enums";
import { sendEmail } from "../../utils/email";

const getPlans = async () => {
  return [
    {
      name: SubscriptionPlan.FREE,
      price: 0,
      badge: null,
      features: [
        "Access to free titles only",
        "480p streaming quality",
        "1 device at a time",
        "Ad-supported experience",
        "Limited new releases",
        "Community reviews & ratings",
      ],
    },
    {
      name: SubscriptionPlan.MONTHLY,
      price: 9.99,
      badge: "Most Popular",
      features: [
        "Access to all premium titles",
        "Full HD 1080p streaming",
        "2 devices simultaneously",
        "Ad-free experience",
        "New releases on day one",
        "Download for offline viewing",
        "Community reviews & ratings",
        "Cancel anytime",
      ],
    },
    {
      name: SubscriptionPlan.YEARLY,
      price: 99.99,
      badge: "Best Value",
      features: [
        "Everything in Monthly",
        "4K Ultra HD + HDR streaming",
        "4 devices simultaneously",
        "Ad-free experience",
        "Early access to new releases",
        "Download for offline viewing",
        "Priority customer support",
        "Exclusive member-only content",
        "Save 16% vs monthly billing",
      ],
    },
  ];
};

const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  plan: SubscriptionPlan,
) => {
  if (plan === SubscriptionPlan.FREE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Free plan does not require a checkout session.",
    );
  }

  const prices: Record<string, number> = {
    [SubscriptionPlan.MONTHLY]: 999, // $9.99 -> 999 cents
    [SubscriptionPlan.YEARLY]: 9999, // $99.99 -> 9999 cents
  };

  // 1. Create temporary stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Censura ${plan} Plan`,
            description: `Unlock premium features with ${plan} subscription.`,
          },
          unit_amount: prices[plan],
          recurring: {
            interval: plan === SubscriptionPlan.MONTHLY ? "month" : "year",
          },
        },
        quantity: 1,
      },
    ],
    // 2. Attach user ID and Plan in metadata to read it back during webhook!
    metadata: {
      userId,
      plan,
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
  });

  return { session_url: session.url };
};

const handleWebhook = async (body: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plan, mediaId, type } = session.metadata || {};

    // --- Subscription flow ---
    if (userId && plan) {
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      if (plan === SubscriptionPlan.MONTHLY) {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else if (plan === SubscriptionPlan.YEARLY) {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }

      const updatedSubscription = await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan: plan as SubscriptionPlan,
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : null,
          currentPeriodStart,
          currentPeriodEnd,
        },
        create: {
          userId,
          plan: plan as SubscriptionPlan,
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : null,
          currentPeriodStart,
          currentPeriodEnd,
        },
      });

      await prisma.payment.create({
        data: {
          subscriptionId: updatedSubscription.id,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || "usd",
          stripePaymentId: session.payment_intent as string,
          status: "COMPLETED",
        },
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        try {
          await sendEmail({
            to: user.email,
            subject: "Your Censura Subscription is Active!",
            templateName: "subscription-success",
            templateData: {
              userName: user.name,
              plan,
              startDate: currentPeriodStart.toLocaleDateString(),
              endDate: currentPeriodEnd.toLocaleDateString(),
              loginUrl: `${envVars.FRONTEND_URL}/login`,
            },
          });
        } catch (emailError) {
          console.error(
            "Failed to send subscription success email",
            emailError,
          );
        }
      }
    }

    // --- Media purchase / rental flow ---
    if (userId && mediaId && type) {
      const RENTAL_DURATION_HOURS = 48;
      const expiresAt =
        type === MediaPurchaseType.RENTAL
          ? new Date(Date.now() + RENTAL_DURATION_HOURS * 60 * 60 * 1000)
          : null;

      await prisma.mediaPurchase.create({
        data: {
          userId,
          mediaId,
          type: type as MediaPurchaseType,
          status: MediaPurchaseStatus.ACTIVE,
          price: (session.amount_total || 0) / 100,
          expiresAt,
          stripePaymentId: session.payment_intent as string,
        },
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        try {
          await sendEmail({
            to: user.email,
            subject: `Your ${type === MediaPurchaseType.RENTAL ? "Rental" : "Purchase"} is Confirmed!`,
            templateName: "media-purchase-success",
            templateData: {
              userName: user.name,
              type,
              expiresAt: expiresAt?.toLocaleDateString() ?? "Never (Permanent)",
              loginUrl: `${envVars.FRONTEND_URL}/login`,
            },
          });
        } catch (emailError) {
          console.error("Failed to send media purchase email", emailError);
        }
      }
    }
  }

  return { received: true };
};

const getSubscriptionStatus = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return { status: SubscriptionStatus.EXPIRED, plan: SubscriptionPlan.FREE };
  }

  if (
    subscription.currentPeriodEnd &&
    new Date() > subscription.currentPeriodEnd &&
    subscription.status === SubscriptionStatus.ACTIVE
  ) {
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: SubscriptionStatus.EXPIRED },
    });
    return updated;
  }

  return subscription;
};

const getPaymentHistory = async (userId: string) => {
  // Since we don't have a Payment model, returning the subscription(s) is typically enough
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return subscriptions;
};

export const SubscriptionService = {
  getPlans,
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  getPaymentHistory,
};
