"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  getSubscriptionPlans,
  createCheckoutSession,
} from "@/services/subscription.service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface PricingSectionProps {
  className?: string;
}
const mockplans = [
  {
    name: "FREE",
    price: 0,
    features: [
      "Access to basic content",
      "SD streaming quality",
      "1 device at a time",
      "Limited library access",
      "Ad-supported viewing",
    ],
  },
  {
    name: "MONTHLY",
    price: 9.99,
    features: [
      "Full content library",
      "HD & 4K streaming",
      "2 devices at a time",
      "No ads",
      "Download for offline viewing",
      "Early access to new releases",
    ],
  },
  {
    name: "YEARLY",
    price: 89.99,
    features: [
      "Everything in Monthly",
      "4 devices at a time",
      "Unlimited downloads",
      "Priority customer support",
      "Exclusive member content",
      "2 months free",
    ],
  },
];
export default function PricingSection({
  className = "",
}: PricingSectionProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchPlans = async () => {
  //     try {
  //       const response = (await getSubscriptionPlans()) as any;
  //       setPlans(response?.data?.data || []);
  //     } catch (error) {
  //       toast.error("Failed to load subscription plans.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchPlans();
  // }, []);
  useEffect(() => {
    setPlans(mockplans);
    setLoading(false);
  }, []);
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

  if (loading) {
    return (
      <div className={`flex h-64 items-center justify-center ${className}`}>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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
          {plans.map((plan) => {
            const isPopular = plan.name === "MONTHLY";
            const isFree = plan.name === "FREE";

            return (
              <Card
                key={plan.name}
                className={`relative flex flex-col h-full transition-transform hover:-translate-y-2 duration-150 ${
                  isPopular
                    ? "border-primary scale-105 z-10 bg-secondary/60"
                    : "border-secondary/45 bg-secondary/35"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <h3 className="text-orange-700 font-bold uppercase tracking-wider text-xs">
                      Most Popular
                    </h3>
                  </div>
                )}

                <CardHeader className="text-center pt-8 pb-4">
                  <CardTitle className="text-2xl font-bold uppercase tracking-wide text-neutral-300">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-white">
                      ${plan.price}
                    </span>
                    {!isFree && (
                      <span className="text-muted-foreground text-sm font-medium">
                        /{plan.name === "MONTHLY" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>
                  <CardDescription className="pt-2 text-neutral-400">
                    {isFree
                      ? "Basic access forever"
                      : `Billed ${plan.name.toLowerCase()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-1 px-8">
                  <ul className="space-y-3 my-5">
                    {plan.features.map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <Check className="size-4" />
                        </div>
                        <span className="text-sm font-medium text-neutral-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-center mt-5">
                    <Button
                      size={"xl"}
                      variant={isPopular ? "default" : "secondary"}
                      disabled={isFree || processingPlan !== null}
                      onClick={() => handleSubscribe(plan.name)}
                    >
                      {processingPlan === plan.name ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : isFree ? (
                        "Current Plan"
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
