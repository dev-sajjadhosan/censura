import { ChevronRight, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 px-4 text-center">
      <div className="rounded-full bg-red-500/20 p-6 flex items-center justify-center shadow-2xl shadow-red-500/20">
        <XCircle className="size-15 text-red-500" />
      </div>

      <div className="space-y-4 max-w-lg">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          It looks like you cancelled the checkout process. If you encountered
          any issues, please feel free to try again or contact support.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link href="/subscription">
          <Button size="lg" variant="default">
            Try Again <RotateCcw />
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="ghost">
            Return Home <ChevronRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}
