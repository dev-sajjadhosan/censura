import { IProfileResponse } from "@/types/auth.types";
import ReviewCard from "../Review/reviewCard";
import { Review } from "@/types/media.types";
import { MessageSquare } from "lucide-react";

export default function ReviewSection({
  initialReviews = [],
  user,
}: {
  initialReviews?: Review[];
  user?: IProfileResponse | null;
}) {
  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">See All Reviews</h2>
          <p className="text-sm text-muted-foreground">
            {initialReviews?.length} Reviews
          </p>
        </div>

        <div className="grid gap-5">
          {initialReviews?.map((review: Review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwn={user?.id === review.userId}
              currentUser={user}
            />
          ))}
          {initialReviews?.length === 0 && (
            <div className="py-12 h-95 flex items-center justify-center text-center bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800">
              <div className="flex flex-col items-center gap-2">
                <MessageSquare className="size-10" />
                <h1 className="text-lg font-semibold">No Reviews Yet</h1>
                <p className="text-neutral-500">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Pagination Here */}
      </div>
    </>
  );
}
