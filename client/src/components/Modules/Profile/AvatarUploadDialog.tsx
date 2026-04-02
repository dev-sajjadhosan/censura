"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Link as LinkIcon,
  Loader,
  Save,
  UserPen,
  ArrowLeft,
  Search,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IProfileResponse } from "@/types/auth.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/user.service";
import { Separator } from "@/components/ui/separator";

interface AvatarUploadDialogProps {
  user: IProfileResponse;
}

// Keep the predefined list
const avatarList = [
  {
    id: 1,
    url: "https://i.pinimg.com/474x/ac/ca/62/acca6213220b4ddbd3378f03a2815386.jpg",
  },
  {
    id: 2,
    url: "https://i.pinimg.com/736x/05/b2/fe/05b2fec459ab5f1d4674bd009b304d3a.jpg",
  },
  {
    id: 3,
    url: "https://i.pinimg.com/736x/fe/67/72/fe6772258f0ee5a9dc85c2f7f415f0de.jpg",
  },
  {
    id: 4,
    url: "https://i.pinimg.com/736x/78/6f/d4/786fd4427cd7e9d638c9e3520fb0d119.jpg",
  },
  {
    id: 5,
    url: "https://i.pinimg.com/736x/cc/da/f2/ccdaf230d29ea7728b28db992e669129.jpg",
  },
  {
    id: 6,
    url: "https://i.pinimg.com/736x/00/da/cf/00dacf2e5d89f0ad9ab203fad19b4062.jpg",
  },
  {
    id: 7,
    url: "https://i.pinimg.com/736x/68/b3/90/68b390ed3f179a35928d40813b2d0268.jpg",
  },
  {
    id: 8,
    url: "https://i.pinimg.com/736x/78/27/e5/7827e5f78fb629a67919b45596e0306b.jpg",
  },
  {
    id: 9,
    url: "https://i.pinimg.com/736x/22/e0/1d/22e01df3e9215a79008d30e522ec78c5.jpg",
  },
  {
    id: 10,
    url: "https://i.pinimg.com/736x/e1/43/5b/e1435b5f108c2edf2c6873a65fb487fa.jpg",
  },
];

export default function AvatarUploadDialog({ user }: AvatarUploadDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  // Start with current image or a sensible default
  const currentImage =
    user?.profile?.image || user?.image || "https://github.com/shadcn.png";
  const [preview, setPreview] = useState<string>(currentImage);

  const initials = useMemo(() => {
    return (
      user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  }, [user?.name]);

  // Mutation for updating profile image
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (url: string) => {
      // NOTE: Adjust service call to match your actual implementation structure
      // e.g., if you need 'name' from previous part, ensure updateProfile can handle just 'image'
      await updateProfile({ image: url });
    },
    onSuccess: () => {
      toast.success("Avatar updated successfully.");
      // Invalidate queries so parent component refetches new user data
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setOpen(false);
    },
    onError: (error: any) => {
      console.error(error?.message);
      toast.error(error?.response?.data?.message || "Failed to update avatar.");
    },
  });

  return (
    <>
      {/* Main Selection Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="gap-2">
            <UserPen size={16} />
            Change Avatar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl bg-background border p-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-4 mb-4">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Choose your avatar
            </DialogTitle>

            {/* Open nested Link Dialog */}
            <Button
              // size="lg"
              variant="ghost"
              className="rounded-full shrink-0 px-3"
              onClick={() => setLinkDialogOpen(true)}
              title="Upload from URL"
            >
              <LinkIcon size={18} />
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* LARGE PREVIEW */}
            <div className="shrink-0 relative group">
              <Avatar className="size-52 border-4 border-background shadow-xl">
                <AvatarImage
                  src={preview}
                  className="object-cover"
                  alt="Preview"
                />
                <AvatarFallback className="text-5xl font-bold bg-secondary text-secondary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Status Indicator */}
              {preview !== currentImage && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full text-[10px] px-2 font-bold uppercase tracking-wider animate-pulse">
                  Unsaved
                </div>
              )}
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-52 my-auto opacity-60"
            />

            {/* PREDEFINED LIST */}
            <div className="flex flex-col grow w-full">
              <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Quick Select
              </h4>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {avatarList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPreview(item.url)}
                    className="relative group focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition"
                  >
                    <Avatar
                      className={`size-16 cursor-pointer duration-75 transition-all group-hover:border-primary border-2 ${
                        preview === item.url
                          ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "border-transparent"
                      }`}
                    >
                      <AvatarImage src={item.url} className="object-cover" />
                      <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end">
            <Button
              variant="ghost"
              size={"lg"}
              onClick={() => toast.warning("File upload is coming soon!")}
              className="w-full sm:w-auto order-2 sm:order-1 gap-2"
            >
              <RefreshCw size={14} /> Upload local file
            </Button>

            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto order-1 sm:order-2 gap-2 min-w-[160px]"
              onClick={() => mutateAsync(preview)}
              disabled={isPending || preview === currentImage}
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* NESTED LINK DIALOG */}
      <LinkUploadDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onImageSave={(url) => {
          setPreview(url);
          // setOpen(false);
        }}
        initials={initials}
      />
    </>
  );
}

// ==========================================
// NESTED DIALOG COMPONENT
// ==========================================
interface LinkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSave: (url: string) => void;
  initials: string;
}

function LinkUploadDialog({
  open,
  onOpenChange,
  onImageSave,
  initials,
}: LinkUploadDialogProps) {
  const [urlInput, setUrlInput] = useState("");
  const [internalPreview, setInternalPreview] = useState<string | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setUrlInput("");
      setInternalPreview(null);
    }
    onOpenChange(isOpen);
  };

  const handleApply = () => {
    if (!urlInput || !urlInput.startsWith("http")) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setInternalPreview(urlInput);
  };

  const handleConfirm = () => {
    if (!internalPreview) return;

    onImageSave(internalPreview);
    onOpenChange(false);
    toast.success(
      "Image URL applied. Click 'Save' in the main window to finalize.",
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border p-7 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft size={16} className="text-muted-foreground" />
          </Button>
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Load Image via Link
          </DialogTitle>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Avatar className="size-36 border-2 border-border shadow-inner bg-muted">
              <AvatarImage
                src={internalPreview || ""}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl font-mono text-muted-foreground/50 bg-secondary/30">
                {internalPreview ? "?" : initials}
              </AvatarFallback>
            </Avatar>
            {!internalPreview && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full text-white/90">
                <Search size={32} className="opacity-70" />
              </div>
            )}
          </div>

          <div className="grid w-full gap-2.5">
            <Label
              htmlFor="image-url"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Direct Image URL
            </Label>
            <div className="flex flex-col items-start gap-1 w-full">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/avatar.png"
                value={internalPreview || ""}
                onChange={(e) => setInternalPreview(e.target.value)}
                className="grow font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <Button
            variant="ghost"
            type="button"
            size={"lg"}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            type="button"
            size={"lg"}
            onClick={handleConfirm}
            disabled={!internalPreview}
          >
            <Save size={16} /> Use this Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
