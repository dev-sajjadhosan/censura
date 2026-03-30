"use client";
import { useState } from "react";
import {
  getSubscriptionPlans,
  createCheckoutSession,
} from "@/services/subscription.service";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { SubscriptionPlan } from "@/types/payment.types";
import PricingCard from "../Subscription/PricingCard";
import { PricingSkeleton } from "../Subscription/PricingSkeleton";
import { IProfileResponse } from "@/types/auth.types";

interface PricingSectionProps {
  className?: string;
  user: IProfileResponse;
}

export default function PricingSection({
  className = "",
  user,
}: PricingSectionProps) {
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => getSubscriptionPlans(),
  });

  const handleSubscribe = async (planName: string) => {
    try {
      setProcessingPlan(planName);
      const res = (await createCheckoutSession({ plan: planName })) as any;
      if (res?.data?.data?.session_url) {
        window.location.href = res.data.data.session_url;
      } else {
        toast.error("Failed to initiate checkout");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong during checkout.",
      );
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-2xl tracking-tight lg:text-5xl mb-3 text-white">
            Choose Your Plan
          </h2>
          <p className="text-md text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features, HD/4K streaming, and get the ultimate
            experience with our subscription plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {isLoading ? (
            <>
              <PricingSkeleton featureCount={6} />
              <PricingSkeleton featureCount={8} isPopular />
              <PricingSkeleton featureCount={9} />
            </>
          ) : (
            data?.data?.map((plan: SubscriptionPlan) => (
              <PricingCard
                key={plan.name}
                user={user}
                plan={plan}
                isPopular={plan.name === "MONTHLY"}
                isFree={plan.name === "FREE"}
                processingPlan={processingPlan}
                handleSubscribe={handleSubscribe}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
