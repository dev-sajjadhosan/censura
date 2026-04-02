"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Save, Pencil, X, Mail, User2, BookOpen } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { IProfileProps, profileSchema } from "@/zod/auth.validation";
import FieldWrapper from "./FieldWrapper";
import SectionHeader from "./SectionHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IProfileResponse } from "@/types/auth.types";
import AvatarUploadDialog from "./AvatarUploadDialog";
import { updateProfile } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";

export default function ProfileSection({ user }: { user: IProfileResponse }) {
  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IProfileProps) => {
      await updateProfile(data);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      setIsEditing(false); // Switch back to view mode
    },
    onError: (e: any) => toast.error(e?.message || "Failed to update profile."),
  });

  const form = useForm({
    defaultValues: {
      name: user?.name,
      bio: user?.profile?.bio ?? "",
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync(value);
      } catch (e: any) {
        console.error(e.message);
      }
    },
  });

  const initials = `${user?.name[0]}`.toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Profile Information"
          desc="Update your display name, username, and bio."
        />
        {!isEditing && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Pencil />
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-15">
        <div className="flex flex-col items-center">
          <Avatar className="size-55 border-2 border-background shadow-sm">
            <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground max-w-xs mt-3 mb-5">
            JPG, PNG or WebP · Max 2MB
          </p>
          <AvatarUploadDialog user={user} />
        </div>

        {!isEditing ? (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <Badge
            className="py-4 px-3"
              variant={user?.status === "ACTIVE" ? "default" : "destructive"}
            >
              {user?.status}
            </Badge>
            <InfoCard
              icon={<User2 size={18} />}
              label="Full Name"
              value={user?.name}
            />
            <InfoCard
              icon={<Mail size={18} />}
              label="Email Address"
              value={user?.email}
              isMuted
            />
            <InfoCard
              icon={<BookOpen size={18} />}
              label="Bio"
              value={user?.profile?.bio || "No bio added yet..."}
              isLongText
            />
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300 w-full"
          >
            <form.Field
              name="name"
              validators={{ onChange: profileSchema.shape.name }}
            >
              {(field) => (
                <FieldWrapper
                  label="Name"
                  error={field.state.meta.errors?.[0]?.message}
                >
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter your name"
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <FieldWrapper label="Email address">
              <Input
                value={user?.email}
                disabled
                className="bg-muted/50 cursor-not-allowed opacity-70"
              />
            </FieldWrapper>

            <form.Field name="bio">
              {(field) => (
                <FieldWrapper label="Bio">
                  <Textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Tell the community a little about yourself..."
                    rows={4}
                    className="resize-none"
                    maxLength={300}
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Describe yourself
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {field.state.value.length}/300
                    </p>
                  </div>
                </FieldWrapper>
              )}
            </form.Field>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                size={"lg"}
                className="gap-2 min-w-[140px]"
              >
                {isPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                size={"lg"}
                onClick={() => setIsEditing(false)}
                className="gap-2"
              >
                <X size={16} /> Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable component for the View Mode fields
 */
function InfoCard({
  label,
  value,
  icon,
  isMuted = false,
  isLongText = false,
}: {
  label: string;
  value?: string;
  icon: React.ReactNode;
  isMuted?: boolean;
  isLongText?: boolean;
}) {
  return (
    <div className="flex gap-3 p-2">
      <div className="text-muted-foreground/70">{icon}</div>
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </p>
        <p
          className={`text-sm ${isMuted ? "text-muted-foreground/80" : "text-foreground font-medium"} ${isLongText ? "leading-relaxed" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
