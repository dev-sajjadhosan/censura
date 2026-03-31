import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/media.types";
import ReviewForm from "./ReviewForm";
import { IProfileResponse, User } from "@/types/auth.types";
import { Edit } from "lucide-react";

export default function EditReviewModal({
  initialReview,
  user,
}: {
  initialReview: Review;
  user: IProfileResponse;
}) {

    console.log("initialReview", initialReview);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size={"icon-lg"}>
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl p-7 bg-secondary">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <ReviewForm
            mediaId={initialReview.mediaId}
            user={user}
            initialReview={initialReview}
            isEdit={true}

          />
        </DialogContent>
      </Dialog>
    </>
  );
}
