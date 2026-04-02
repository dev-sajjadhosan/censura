"use client";

import { useEffect } from "react";
import { MoveLeft, RotateCcw, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-lg">
        <div className="flex justify-center">
          <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 animate-pulse">
            <AlertTriangle className="size-13 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-white leading-15">
            Oops! <br /> System Glitch
          </h1>
          <p className="text-muted-foreground text-lg">
            Something went wrong while processing this page. Our team has been
            notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={() => reset()} size={"xl"}>
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>

          <Button variant={"ghost"} size={"xl"} asChild>
            <Link href="/">
              <MoveLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground/50 font-mono pt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
