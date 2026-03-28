"use client";

import UsersTable from "./Users/UsersTable";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function UsersClient() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage registered users, roles, and status.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <UsersTable />
      </Suspense>
    </div>
  );
}
