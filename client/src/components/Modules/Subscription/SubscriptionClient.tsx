"use client";

import {
  Crown,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Subscription } from "@/types/payment.types";
import { cancelSubscription } from "@/services/subscription.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubscriptionClient({
  subscription,
  isActive,
}: {
  subscription: Subscription;
  isActive: boolean;
}) {
  const router = useRouter();

  const planLabel: Record<string, string> = {
    FREE: "Free",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  };

  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";

  const handleCancel = async () => {
    try {
      await cancelSubscription();
      toast.success("Subscription cancelled successfully");
      router.refresh(); // Refresh server data
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel");
    }
  };

  return (
    <Card className="bg-transparent p-7">
      <CardHeader>
        <CardTitle className="text-lg text-neutral-300">Current Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 mt-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {planLabel[subscription?.plan ?? "FREE"] ?? "Free"}
              </p>
              <p className="text-sm text-neutral-400">
                {subscription?.plan === "FREE"
                  ? "Basic access"
                  : "Premium access"}
              </p>
            </div>
          </div>

          <Badge
            className={
              isActive ? "bg-green-500/10 text-green-400" : "bg-neutral-700/40"
            }
          >
            {isActive ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {subscription?.status ?? "FREE"}
          </Badge>
        </div>

        <Separator className="bg-secondary/40" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-neutral-500 mt-0.5" />

            <div>
              <p className="text-sm text-neutral-400">Current period start</p>

              <p className="text-white font-medium">
                {formatDate(subscription?.currentPeriodStart)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-neutral-500 mt-0.5" />

            <div>
              <p className="text-sm text-neutral-400">Renews / Expires on</p>

              <p className="text-white font-medium">
                {formatDate(subscription?.currentPeriodEnd)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-neutral-500 mt-0.5" />

            <div>
              <p className="text-sm text-neutral-400">Payment method</p>

              <p className="text-white font-medium">
                {subscription?.stripeCustomerId ? "Card on file" : "None"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-neutral-500 mt-0.5" />

            <div>
              <p className="text-sm text-neutral-400">Auto renew</p>

              <p className="text-white font-medium">
                {subscription?.cancelAtPeriodEnd
                  ? "Cancelled at period end"
                  : "Enabled"}
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            <Separator className="bg-secondary/40" />
            <div className="flex justify-end">
              <Button variant="secondary" size="lg" onClick={handleCancel}>
                Cancel Subscription
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
