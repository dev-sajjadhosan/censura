"use client";

import { Suspense } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import CommentTable from "./CommentTable";

export default function CommentClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
             <MessageSquare className="size-6 text-primary" />
             <h1 className="text-2xl font-bold tracking-tight">User Comments</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Moderate user reviews and discussion comments.
          </p>
        </div>
      </div>

      <Suspense fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-7 animate-spin text-muted-foreground" />
          </div>
      }>
        <CommentTable />
      </Suspense>
    </div>
  );
}