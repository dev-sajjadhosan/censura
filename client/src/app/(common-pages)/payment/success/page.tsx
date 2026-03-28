import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center space-y-8 px-4 text-center">
      <div className="rounded-full bg-green-500/20 p-6 flex items-center justify-center shadow-2xl shadow-green-500/20">
        <CheckCircle className="h-24 w-24 text-green-500 animate-pulse" />
      </div>
      
      <div className="space-y-4 max-w-lg">
        <h1 className="text-4xl font-extrabold tracking-tight">Payment Successful!</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Thank you for subscribing! Your transaction has been completed successfully and a receipt has been emailed to you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link href="/profile/subscription">
          <Button size="lg" className="h-12 px-8 text-md shadow-lg" variant="default">
            View My Plan
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" className="h-12 px-8 text-md" variant="secondary">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
