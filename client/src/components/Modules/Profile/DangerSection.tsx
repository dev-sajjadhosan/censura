"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, LogOut, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";
import SectionHeader from "./SectionHeader";
import { deleteProfile, toggleDeactivateUser } from "@/services/user.service";
import { IProfileResponse } from "@/types/auth.types";
import { Badge } from "@/components/ui/badge";

export default function DangerSection({ user }: { user: IProfileResponse }) {
  const [confirmText, setConfirmText] = useState("");
  const CONFIRM_PHRASE = "delete my account";

  const { mutateAsync: deactivate, isPending: isDeactivating } = useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      await toggleDeactivateUser(payload?.id, payload);
    },
    onSuccess: () => toast.success("Account deactivated."),
    onError: (e: any) => toast.error(e?.message),
  });

  const { mutateAsync: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await deleteProfile(id);
    },
    onSuccess: () => toast.success("Account deletion requested."),
    onError: (e: any) => toast.error(e?.message),
  });

  return (
    <div>
      <SectionHeader
        title="Danger Zone"
        desc="Irreversible actions. Please read carefully before proceeding."
      />

      {/* Deactivate */}
      <div className="rounded-xl p-6 bg-yellow-500/5 mb-4">
        <div className="flex items-start gap-3 mb-6">
          <LogOut size={18} className="text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium mb-1">
              Deactivate account{" "}
              <Badge
                className="py-3"
                variant={
                  user?.status === "DEACTIVATED" ? "destructive" : "default"
                }
              >
                {user?.status}
              </Badge>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Temporarily deactivate your account. Your profile, reviews, and
              data will be hidden but not deleted. You can reactivate anytime by
              logging back in.
            </p>
          </div>
        </div>

        {user?.status === "DEACTIVATED" ? (
          <Button
            variant="outline"
            size="lg"
            className="border-green-500/30 text-green-500 hover:bg-green-500/10 gap-2"
            disabled={isDeactivating}
            onClick={() => deactivate({ id: user.id, status: "ACTIVE" })}
          >
            {isDeactivating ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <UserX size={14} />
            )}
            Reactivate account
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 gap-2"
            disabled={isDeactivating}
            onClick={() => deactivate({ id: user.id, status: "DEACTIVATED" })}
          >
            {isDeactivating ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <UserX size={14} />
            )}
            Deactivate account
          </Button>
        )}
      </div>

      {/* Delete */}
      <div className="rounded-xl p-6 bg-red-500/5">
        <div className="flex items-start gap-3 mb-9">
          <Trash2 size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400 mb-1">
              Delete account permanently
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will permanently delete your account, all reviews, comments,
              watchlist, and subscription data. This action{" "}
              <span className="text-red-400 font-medium">cannot be undone</span>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">
              Type{" "}
              <span className="font-mono text-red-400 select-none">
                {CONFIRM_PHRASE}
              </span>{" "}
              to confirm
            </label>
            <div className="flex items-center gap-3 border border-red-500/20  focus:border-red-500/40 px-3 rounded-lg">
              <Trash2 className="size-5 text-red-500" />
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                className="bg-transparent"
              />
            </div>
          </div>

          <Button
            variant="destructive"
            size="lg"
            disabled={confirmText !== CONFIRM_PHRASE || isDeleting}
            className="w-fit gap-2"
            onClick={() => deleteAccount(user.id)}
          >
            {isDeleting ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Delete my account
          </Button>
        </div>
      </div>
    </div>
  );
}
