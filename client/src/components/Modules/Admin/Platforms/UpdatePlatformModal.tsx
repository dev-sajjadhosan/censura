"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Platform } from "@/types/media.types";
import { PlatformForm } from "./PlatformForm";
import { Globe } from "lucide-react";

interface UpdatePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform | null;
}

export const UpdatePlatformModal = ({
  isOpen,
  onClose,
  platform,
}: UpdatePlatformModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-linear-to-tr from-primary/10 via-background to-background p-8 space-y-8">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Globe className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <DialogTitle className="text-2xl font-bold tracking-tight">Modify Portal</DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  Update integration settings for {platform?.platform}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <PlatformForm
            initialData={platform}
            onSuccess={onClose}
            onCancel={onClose}
            isModal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
