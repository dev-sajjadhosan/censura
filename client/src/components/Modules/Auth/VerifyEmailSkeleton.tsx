import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyEmailSkeleton() {
  return (
    <div className="h-full flex items-center">
      <div className="flex flex-col items-start justify-center gap-1 w-2xl">
        <Skeleton className="h-10 w-40 rounded-full" />

        <Skeleton className="h-10 w-64 mt-2" />

        <div className="space-y-2 mt-2 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex flex-col gap-3 mt-9">
          <Skeleton className="h-5 w-48" />

          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-10 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-8 w-4" />
            <div className="flex gap-2">
              {[4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 w-10 rounded-md" />
              ))}
            </div>
          </div>

          <Skeleton className="h-14 w-44 mt-9 rounded-md" />
        </div>

        <div className="flex items-center gap-2 mt-9 w-full">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
