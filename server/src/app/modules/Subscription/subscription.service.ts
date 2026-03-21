import { Stripe } from "stripe";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../error-helpers/AppError";
import httpStatus from "http-status";
import { envVars } from "../../config/env";
import { SubscriptionPlan, SubStatus } from "../../../generated/prisma/enums";
import { sendEmail } from "../../utils/email";

const getPlans = async () => {
  return [
    {
      name: SubscriptionPlan.FREE,
      price: 0,
      features: ["Basic Access", "Limited Quality"],
    },
    {
      name: SubscriptionPlan.MONTHLY,
      price: 9.99,
      features: ["Premium Access", "HD Streaming", "Cancel Anytime"],
    },
    {
      name: SubscriptionPlan.YEARLY,
      price: 99.99,
      features: ["Premium Access", "4K Streaming", "Save 16%"],
    },
  ];
};

const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  plan: SubscriptionPlan
) => {
  if (plan === SubscriptionPlan.FREE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Free plan does not require a checkout session."
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
    // 3. Verify signature to ensure the request is actually from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  // 4. Handle successful payment event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Read the metadata we attached during checkout
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as SubscriptionPlan;

    if (!userId || !plan) {
      throw new AppError(httpStatus.BAD_REQUEST, "Missing metadata in session");
    }

    const startDate = new Date();
    const endDate = new Date();
    if (plan === SubscriptionPlan.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === SubscriptionPlan.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // 5. Update Database to activate the user's subscription!
    await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan,
        status: SubStatus.ACTIVE,
        stripeSessionId: session.id,
        startDate,
        endDate,
      },
      create: {
        userId,
        plan,
        status: SubStatus.ACTIVE,
        stripeSessionId: session.id,
        startDate,
        endDate,
      },
    });

    // Fetch user details for the email
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
            startDate: startDate.toLocaleDateString(),
            endDate: endDate.toLocaleDateString(),
            loginUrl: `${envVars.FRONTEND_URL}/login`,
          },
        });
        console.log(`Success email sent to ${user.email}`);
      } catch (emailError) {
        console.error("Failed to send subscription success email", emailError);
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
    return { status: SubStatus.EXPIRED, plan: SubscriptionPlan.FREE };
  }

  if (subscription.endDate && new Date() > subscription.endDate && subscription.status === SubStatus.ACTIVE) {
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: SubStatus.EXPIRED },
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
