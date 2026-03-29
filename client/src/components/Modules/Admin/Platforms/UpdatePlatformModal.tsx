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
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none rounded-3xl shadow-muted">
        <div className="p-5 space-y-5">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="space-y-0.5">
                <DialogTitle className="text-xl tracking-tight">
                  Modify Platfrom
                </DialogTitle>
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
