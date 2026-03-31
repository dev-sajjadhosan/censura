"use client";

import ReviewsTable from "./Reviews/ReviewsTable";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { TabStatus } from "@/app/(admin-pages)/admin/reviews/page";

export default function ReviewsClient({initialStatus}: {initialStatus: TabStatus}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor and manage user-submitted reviews and ratings.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ReviewsTable initialQueryString={initialStatus} />
      </Suspense>
    </div>
  );
}
