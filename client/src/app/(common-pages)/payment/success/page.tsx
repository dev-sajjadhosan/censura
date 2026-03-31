import { CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 px-4 text-center">
      <div className="rounded-full bg-green-500/20 p-6 flex items-center justify-center">
        <CheckCircle className="size-13 text-green-500 animate-pulse" />
      </div>

      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Thank you for subscribing! Your transaction has been completed
          successfully and a receipt has been emailed to you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link href="/profile/subscription">
          <Button size="lg" variant="default">
            View My Plan
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
