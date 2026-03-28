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
import { adminDeleteMedia } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteMediaDialogProps {
  media: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteMediaDialog({
  media,
  open,
  onOpenChange,
}: DeleteMediaDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync: deleteMedia } = useMutation({
    mutationFn: (id: string) => adminDeleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success(`"${media?.title}" deleted successfully`);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete media");
    },
  });

  const handleAction = async () => {
    if (!media) return;
    try {
      setIsDeleting(true);
      await deleteMedia(media.id);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!media) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
            <Trash2 className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-bold text-red-500">
            Delete Media Content?
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete <span className="font-bold text-foreground">"{media.title}"</span>? 
            This action is permanent and cannot be undone. All related reviews and metadata will be removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleAction}
            disabled={isDeleting}
            className="px-8 shadow-lg shadow-red-500/20"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
