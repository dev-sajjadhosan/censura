import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Comment } from "@/types/reaction.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ViewCommentDialog({
  comment,
  open,
  onOpenChange,
}: {
  comment: Comment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!comment) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-7 border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Comment Details</DialogTitle>
            <Badge>{comment.status}</Badge>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm italic">
            "{comment.content}"
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Avatar className="size-25">
                <AvatarImage
                  src={comment?.user.image}
                  alt={comment?.user.name}
                />
                <AvatarFallback>{comment?.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-muted-foreground font-semibold">User</p>
                <p>{comment.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-25">
                <AvatarImage
                  src={comment?.media.posterUrl}
                  alt={comment?.media.title}
                />
                <AvatarFallback>{comment?.media.title.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-muted-foreground font-semibold">Media</p>
                <p>{comment.media?.title}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
