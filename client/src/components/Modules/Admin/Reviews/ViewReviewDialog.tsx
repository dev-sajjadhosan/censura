import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  User as UserIcon,
  Calendar,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { Review } from "@/types/media.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ViewReviewDialogProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewReviewDialog({
  review,
  open,
  onOpenChange,
}: ViewReviewDialogProps) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-card border-border shadow-2xl p-9">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl font-bold tracking-tight">
              Review Details
            </DialogTitle>
            <Badge
              variant={review.status === "APPROVED" ? "default" : "destructive"}
              className="capitalize py-3"
            >
              {review.status.toLowerCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Sidebar Info */}
          <div className="space-y-4 border-r border-border pr-4 hidden md:block">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Author
              </p>
              <div className="flex items-center gap-2">
                <Avatar className="size-13">
                  <AvatarImage
                    src={review?.user?.image || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>
                    {review?.user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h1 className="text-xs">
                    {review?.user?.name || "Anonymous"}
                  </h1>
                  <Badge
                    variant={
                      review.user.status === "ACTIVE"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {review.user.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Rating
              </p>
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 w-fit px-2 py-1 rounded-md">
                <Star className="size-4 fill-amber-500" />
                <span className="font-bold text-sm">{review.rating}/10</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Stats
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ThumbsUp className="size-3.5" /> {review.likes?.length || 0}{" "}
                  Likes
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageSquare className="size-3.5" />{" "}
                  {review.comments?.length || 0} Comments
                </div>
              </div>
            </div>

            {review.hasSpoiler && (
              <div className="flex items-center gap-2 text-destructive font-medium text-xs bg-destructive/10 p-2 rounded-md">
                <AlertTriangle className="size-3.5" />
                Contains Spoilers
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 md:hidden">
                <span className="font-semibold text-foreground">
                  {review.user?.name}
                </span>
                <span>•</span>
                <Calendar className="size-3" />
                {format(new Date(review.createdAt), "MMM dd, yyyy")}
              </div>
              <h3 className="text-lg font-semibold leading-tight">
                {review.title}
              </h3>
              <p className="text-xs text-muted-foreground hidden md:flex items-center gap-1">
                <Calendar className="size-3" />
                Posted on {format(new Date(review.createdAt), "MMMM dd, yyyy")}
              </p>
            </div>

            <ScrollArea className="min-h-[250px] pr-4 text-sm leading-relaxed text-muted-foreground border-t border-border pt-4">
              {review.content}
            </ScrollArea>

            <div className="flex flex-wrap gap-2 pt-2">
              {review.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] font-normal"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
