import PricingSection from "@/components/Modules/Home/PricingSection";
import { getCurrentUser } from "@/services/user.service";
import { IProfileResponse } from "@/types/auth.types";

export default async function SubscriptionPage() {
  const user = await getCurrentUser()

  return (
    <div className="py-10">
      <PricingSection user={user as IProfileResponse} />
    </div>
  );
}
