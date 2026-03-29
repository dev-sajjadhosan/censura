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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <AlertDialogContent className="sm:min-w-3xl! rounded-3xl border-none bg-secondary shadow-2xl p-7 flex flex-col">
        <AlertDialogHeader className="w-full!">
          <AlertDialogTitle className="text-xl tracking-tight">
            Remove Streaming Portal?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            This will remove{" "}
            <span className="font-bold text-orange-500">
              "{deletingPlatform?.name}"
            </span>{" "}
            from the integration index. Any media items referencing this portal
            will lose their outbound streaming links. This action can't be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center text-center mx-auto my-5 max-w-md">
          <div className="flex items-center gap-3">
            <Avatar className="size-13">
              <AvatarImage src={deletingPlatform?.icon} />
              <AvatarFallback>
                {deletingPlatform?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-xl">{deletingPlatform?.name}</h1>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mt-2">
            {deletingPlatform?.description}
          </p>
        </div>

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
      </AlertDialogContent>
    </AlertDialog>
  );
}
