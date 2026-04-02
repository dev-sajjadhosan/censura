"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PaymentTable from "./PaymentTable";

export default function PaymentClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all payment-related activities.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-7 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <PaymentTable />
      </Suspense>
    </div>
  );
}
