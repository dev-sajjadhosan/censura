import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export default function GenreDeleteModal({
  deletingGenre,
  deleteMutation,
  setDeletingGenre,
}: {
  deletingGenre: any;
  deleteMutation: any;
  setDeletingGenre: any;
}) {
  return (
    <>
      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deletingGenre}
        onOpenChange={(open) => !open && setDeletingGenre(null)}
      >
        <AlertDialogContent className="sm:max-w-2xl! p-7 bg-muted">
          <div className="flex flex-col p-0">
            <div>
              <AlertDialogTitle className="text-xl tracking-tight">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
                This will permanently delete the category{" "}
                <span className="font-semibold text-orange-500">
                  "{deletingGenre?.name}"
                </span>
                . This action cannot be undone and may affect media items
                currently tagged with this genre.
              </AlertDialogDescription>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <AlertDialogCancel size={"lg"} variant={"ghost"}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                size={"lg"}
                onClick={() =>
                  deletingGenre && deleteMutation.mutate(deletingGenre.id)
                }
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  "Confirming..."
                ) : (
                  <>
                    <Trash2 /> Yes, Delete
                  </>
                )}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
