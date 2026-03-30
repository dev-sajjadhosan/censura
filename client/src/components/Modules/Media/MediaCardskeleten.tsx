import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MediaCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-40 rounded-xl" />
        <div className="p-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4 mt-2" />
          <div className="flex items-center gap-3 mt-3">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}