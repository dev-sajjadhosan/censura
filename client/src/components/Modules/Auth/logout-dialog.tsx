import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Trash2 } from "lucide-react";

export default function LogoutDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:min-w-xl h-52 p-9 bg-accent">
          <DialogTitle>Are you sure you want to logout?</DialogTitle>
          <DialogDescription>
            Do you also want to delete your account? Or just want to logout for
            now?
          </DialogDescription>
          <div className="flex items-center justify-end gap-5 mt-3">
            <Button size={"xl"}>
              <Trash2 />
              Delete Account
            </Button>
            <Button variant="outline" size={"xl"}>
              Logout <LogOut />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
