"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { adminUpdateUserStatus } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserX, UserCheck, Loader2 } from "lucide-react";

interface UpdateUserStatusDialogProps {
  user: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateUserStatusDialog({
  user,
  open,
  onOpenChange,
}: UpdateUserStatusDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBlocked = user?.status === "BLOCKED";
  const action = isBlocked ? "unblock" : "block";
  const newStatus = isBlocked ? "ACTIVE" : "BLOCKED";

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: (data: { id: string; status: "ACTIVE" | "BLOCKED" }) =>
      adminUpdateUserStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${action}ed successfully`);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || `Failed to ${action} user`);
    },
  });

  const handleAction = async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      await updateStatus({ id: user.id, status: newStatus });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-secondary p-9">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            {isBlocked ? (
              <UserCheck className="h-6 w-6" />
            ) : (
              <UserX className="h-6 w-6" />
            )}
          </div>
          <DialogTitle className="text-center font-bold">
            {isBlocked ? "Unblock User?" : "Block User?"}
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to {action}{" "}
            <span className="font-semibold text-orange-500">{user.name}</span>?
            {isBlocked
              ? " This will restore their access to the platform."
              : " This will prevent them from logging in or performing any actions."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-5 mt-2">
          <Button
            type="button"
            variant="ghost"
            size={"lg"}
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isBlocked ? "default" : "destructive"}
            size={"lg"}
            onClick={handleAction}
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm? {isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
