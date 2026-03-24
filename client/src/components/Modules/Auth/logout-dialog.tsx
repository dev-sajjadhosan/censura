// "use client";

import { logoutAction } from "@/app/(auth-pages)/logout/_action";
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
// import { useRouter } from "next/navigation";

export default function LogoutDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  // const router = useRouter();
  const handleLogoutClick = async () => {
    try {
      await logoutAction();
      // setOpen(!open);
      // router.refresh();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
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
            <Button variant="outline" size={"xl"} onClick={handleLogoutClick}>
              Logout <LogOut />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
