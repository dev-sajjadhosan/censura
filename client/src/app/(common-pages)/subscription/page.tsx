export const dyanamic = "force-dynamic";

import PricingSection from "@/components/Modules/Home/PricingSection";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/user.service";
import { IProfileResponse } from "@/types/auth.types";
import Link from "next/link";

export default async function SubscriptionPage() {
  const user = await getCurrentUser();

  return (
    <div className="py-10">
      <div className="flex items-center justify-center">
        <Button size={"lg"} className="mx-auto -mb-9 w-fit" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
      <PricingSection user={user as IProfileResponse} />
    </div>
  );
}
