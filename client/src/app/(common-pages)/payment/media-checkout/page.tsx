import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CheckoutContent from "@/components/Modules/Payment/PaymnetContent";

export default function MediaCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin size-8 text-primary" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
