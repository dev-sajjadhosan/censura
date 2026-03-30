// components/Media/MediaCardSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MediaCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="h-8 w-16 bg-neutral-700 rounded-full animate-pulse" />
        <div className="h-8 w-16 bg-neutral-700 rounded-full animate-pulse" />
      </CardHeader>
      <CardContent>
        {/* Poster */}
        <div className="w-full h-40 bg-neutral-700 rounded-xl animate-pulse" />

        <div className="p-3 space-y-3">
          {/* Title */}
          <div className="h-5 w-3/4 bg-neutral-700 rounded animate-pulse" />

          {/* Year */}
          <div className="h-4 w-16 bg-neutral-800 rounded animate-pulse" />

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-3">
            <div className="h-10 w-28 bg-neutral-700 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-neutral-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}