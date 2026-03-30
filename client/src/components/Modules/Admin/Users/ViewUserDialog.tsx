import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/auth.types";

export default function ViewUserDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-secondary p-11 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-3">
              <Avatar
                className={`size-35 ${user?.status === "ACTIVE" ? "ring-2 ring-orange-500" : "ring-2 ring-red-500"}`}
              >
                <AvatarImage
                  src={user?.image || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Badge
              className="py-3 px-3"
                variant={user?.status === "ACTIVE" ? "default" : "destructive"}
              >
                {user?.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl">{user?.name}</span>
              <span className="text-sm">{user?.email}</span>
              <p className="text-sm text-muted-foreground">
                {user?.role === "ADMIN" ? "Platform Handler" : "Regular User"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
