"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PricingSkeleton({
  isPopular = false,
  featureCount = 5,
}: {
  isPopular?: boolean;
  featureCount?: number;
}) {
  return (
    <>
      <Card
        className={`relative w-full flex flex-col h-full border-secondary/45 bg-secondary/35 ${
          isPopular ? "scale-105 z-10 border-primary bg-secondary/60" : ""
        }`}
      >
        <CardHeader className="text-center pt-8 pb-4">
          <div className="h-6 w-24 bg-secondary/60 rounded mx-auto animate-pulse" />
          <div className="mt-4 h-12 w-32 bg-secondary/60 rounded mx-auto animate-pulse" />
          <div className="mt-2 h-3 w-28 bg-secondary/40 rounded mx-auto animate-pulse" />
        </CardHeader>
        <CardContent className="px-8">
          <ul className="space-y-3 my-5">
            {Array.from({ length: featureCount }).map((_, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2">
                <div className="size-5 shrink-0 bg-secondary/60 rounded animate-pulse" />
                <div className="h-3 w-full bg-secondary/50 rounded animate-pulse" />
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-5">
            <div className="h-10 w-36 bg-secondary/60 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
