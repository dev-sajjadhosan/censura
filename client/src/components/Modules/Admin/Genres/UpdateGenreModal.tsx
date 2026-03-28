"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Genre } from "@/types/media.types";
import { GenreForm } from "./GenreForm";

interface UpdateGenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  genre: Genre;
}

export const UpdateGenreModal = ({
  isOpen,
  onClose,
  genre,
}: UpdateGenreModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="bg-linear-to-br from-primary/5 via-background to-background p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Edit Genre</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the details and visibility settings for this category.
            </DialogDescription>
          </DialogHeader>

          <GenreForm
            initialData={genre}
            onSuccess={onClose}
            onCancel={onClose}
            isModal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
