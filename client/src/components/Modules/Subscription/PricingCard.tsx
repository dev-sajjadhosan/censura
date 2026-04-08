import { SubscriptionPlan } from "@/types/payment.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { IProfileResponse } from "@/types/auth.types";

interface PricingCardProps {
  plan: SubscriptionPlan;
  isPopular: boolean;
  isFree: boolean;
  processingPlan: string | null;
  handleSubscribe: (planName: string) => void;
  user: IProfileResponse;
}

export default function PricingCard({
  plan,
  isPopular,
  isFree,
  processingPlan,
  handleSubscribe,
  user,
}: PricingCardProps) {
  return (
    <>
      <Card
        key={plan?.name}
        className={`relative flex flex-col h-full transition-transform hover:-translate-y-2 duration-150 ${
          isPopular
            ? "border-primary scale-105 z-10 bg-secondary/60"
            : "border-secondary/45 dark:border-secondary/45 dark:bg-secondary/35"
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
          <CardTitle className="text-2xl font-bold uppercase tracking-wide text-primary">
            {plan?.name}
          </CardTitle>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold tracking-tight text-primary animate-pulse">
              ${plan?.price}
            </span>
            {!isFree && (
              <span className="text-primary text-sm font-medium">
                /{plan?.name === "MONTHLY" ? "mo" : "yr"}
              </span>
            )}
          </div>
          <CardDescription className="pt-2 text-primary">
            {isFree
              ? "Basic access forever"
              : `Billed ${plan?.name.toLowerCase()}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1 px-8">
          <ul className="space-y-3 my-5">
            {plan?.features.map((feature: string, idx: number) => (
              <li key={idx} className="flex items-center justify-between">
                <div>
                  <Check className="size-4" />
                </div>
                <span className="text-sm font-medium text-primary">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-5">
            <Button
              size={"xl"}
              variant={isPopular ? "default" : "secondary"}
              disabled={
                !user ||
                isFree ||
                processingPlan !== null ||
                user?.subscription?.plan === plan?.name
              }
              onClick={() => handleSubscribe(plan?.name)}
            >
              {processingPlan === plan?.name ? (
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
    </>
  );
}
