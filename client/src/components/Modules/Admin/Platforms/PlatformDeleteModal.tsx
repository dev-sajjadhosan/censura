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
import { Platform } from "@/types/media.types";
import { Trash2, X } from "lucide-react";

export default function PlatformDeleteModal({
  deletingPlatform,
  setDeletingPlatform,
  deleteMutation,
}: {
  deletingPlatform: Platform | null;
  setDeletingPlatform: (platform: Platform | null) => void;
  deleteMutation: any;
}) {
  return (
    <AlertDialog
      open={!!deletingPlatform}
      onOpenChange={(open) => !open && setDeletingPlatform(null)}
    >
      <AlertDialogContent className="sm:min-w-3xl! rounded-3xl border-none bg-secondary shadow-2xl p-0 overflow-hidden">
        <div className="p-10 space-y-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-bold tracking-tight">
              Unlink Streaming Portal?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed">
              This will remove{" "}
              <span className="font-bold text-orange-500">
                "{deletingPlatform?.name}"
              </span>{" "}
              from the integration index. Any media items referencing this
              portal will lose their outbound streaming links. This action can't
              be undone.
            </AlertDialogDescription>
            <div className="mt-3 flex gap-4">
              <AlertDialogCancel size={"lg"} variant={"ghost"}>
                <X />
                Keep Portal
              </AlertDialogCancel>
              <AlertDialogAction
                size={"lg"}
                onClick={() =>
                  deletingPlatform && deleteMutation.mutate(deletingPlatform.id)
                }
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  "Unlinking..."
                ) : (
                  <>
                    <Trash2 />
                    Confirm Removal
                  </>
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogHeader>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
