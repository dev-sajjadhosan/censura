import { Crown } from "lucide-react";
import PricingSection from "@/components/Modules/Home/PricingSection";
import { getCurrentUser } from "@/services/user.service";
import { Subscription } from "@/types/payment.types";
import SubscriptionClient from "@/components/Modules/Subscription/SubscriptionClient";

export default async function SubscriptionPage() {
  const user = await getCurrentUser();
  const subscription = user?.subscription as Subscription;

  const isActive =
    subscription?.status === "ACTIVE" && subscription?.plan !== "FREE";

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Crown className="size-5 text-primary" />
          Subscription
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your plan and billing details.
        </p>
      </div>

      {/* Pass data to the Client Component */}
      <SubscriptionClient subscription={subscription} isActive={isActive} />

      {!isActive && (
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Upgrade Your Plan</h2>
          <PricingSection user={user!} />
        </div>
      )}
    </div>
  );
}