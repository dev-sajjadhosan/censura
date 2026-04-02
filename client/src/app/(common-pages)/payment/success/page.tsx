"use client";

import { useEffect } from "react";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

export default function PaymentSuccessPage() {
  const { data: session, isPending, error } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">Verifying your transaction...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 px-4 text-center">
      <div className="rounded-full bg-green-500/20 p-6 flex items-center justify-center">
        <CheckCircle className="size-12 text-green-500 animate-pulse" />
      </div>

      <div className="space-y-4 max-w-xl">
        <h1 className="text-3xl font-extrabold tracking-tight">Payment Successful!</h1>
        <p className="text-muted-foreground leading-relaxed">
          Thank you for your purchase! Your access has been activated successfully.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link href="/profile/subscription">
          <Button size="lg">View My Plan</Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="ghost">
            Return Home <ChevronRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}