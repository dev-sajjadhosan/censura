import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, User, Video, Hash } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Payment } from "@/types/payment.types";

interface ViewPaymentDialogProps {
  payment: Payment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewPaymentDialog({
  payment,
  open,
  onOpenChange,
}: ViewPaymentDialogProps) {
  if (!payment) return null;

  const isCompleted = payment.status === "COMPLETED";
  const media = payment.mediaPurchase?.media || payment.rental?.media;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-7 border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6">
            <span>Transaction Details</span>
            <div className="flex items-center gap-1">
              <Badge
                variant={isCompleted ? "default" : "destructive"}
                className={`py-3 px-3 ${isCompleted ? "bg-green-600" : ""}`}
              >
                {payment.status}
              </Badge>
              <Badge
                className={"py-3 px-3"}
              >
                {payment.mediaPurchase.type}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Section: Payment Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <CreditCard className="size-4" /> Payment Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-lg">
                  {payment.amount} {payment.currency?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stripe ID:</span>
                <span className="font-mono text-xs truncate max-w-[150px]">
                  {payment.stripePaymentId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{format(new Date(payment.createdAt), "PPP p")}</span>
              </div>
            </div>
          </div>

          {/* Section: Customer Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <User className="size-4" /> Customer
            </h4>
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
              <Avatar>
                <AvatarImage
                  src={payment?.user?.image || "https://github.com/shadcn.png"}
                  alt={payment?.user?.image}
                />
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {payment.user?.name || "Guest User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {payment.user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Section: Purchased Item */}
        <div className="py-2">
          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4">
            <Hash className="size-4" /> Purchased Content
          </h4>

          {media ? (
            <div className="flex gap-4 items-start">
              <div className="relative aspect-video w-32 overflow-hidden rounded-md border bg-muted">
                {media.posterUrl ? (
                  <img
                    src={media.posterUrl}
                    alt={media.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Video className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className="w-fit text-[10px]">
                  {payment.mediaPurchase?.type || "RENTAL"}
                </Badge>
                <span className="font-bold">{media.title}</span>
                {payment.rental && (
                  <span className="text-xs text-orange-600 flex items-center gap-1">
                    <Calendar className="size-3" /> Expires:{" "}
                    {format(new Date(payment.rental.expiresAt), "PP")}
                  </span>
                )}
              </div>
            </div>
          ) : payment.subscription ? (
            <div className="p-4 border rounded-md bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium">
                Subscription Plan:{" "}
                <span className="text-blue-600 uppercase">
                  {payment.subscription.plan}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Active until{" "}
                {format(new Date(payment.subscription.currentPeriodEnd), "PPP")}
              </p>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No linked media or subscription info found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
