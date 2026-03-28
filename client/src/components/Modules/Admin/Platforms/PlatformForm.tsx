"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { adminCreatePlatform, adminUpdatePlatform } from "@/services/admin.service";
import { createPlatformSchema, UpdatePlatformInput } from "@/zod/platform.validation";
import { toast } from "sonner";
import { Platform } from "@/types/media.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save, Globe, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlatformFormProps {
  initialData?: Platform | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const PlatformForm = ({
  initialData,
  onSuccess,
  onCancel,
  isModal = false,
}: PlatformFormProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const isEditing = !!initialData;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => adminCreatePlatform(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      toast.success("Platform registered successfully");
      if (onSuccess) onSuccess();
      if (!isModal) router.push("/admin/platforms");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to register platform");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatePlatformInput) =>
      adminUpdatePlatform(payload.id as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      toast.success("Platform updated successfully");
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update platform");
    },
  });

  const form = useForm({
    defaultValues: {
      platform: initialData?.platform || "",
      type: initialData?.type || "",
      url: initialData?.url || "",
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updateMutation.mutateAsync({ ...value, id: initialData.id });
      } else {
        await createMutation.mutateAsync(value);
      }
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <form.Field
          name="platform"
          validators={{
            onSubmit: createPlatformSchema.shape.platform,
          }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Service Provider Name *</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Netflix, Disney+, Apple TV"
                className="h-11 rounded-xl"
              />
              {field.state.meta.errors.length > 0 ? (
                <em className="text-[11px] text-destructive leading-tight block">
                  {field.state.meta.errors[0].message}
                </em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="type"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Subscription Tier / Model</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Ad-supported, Premium, Included"
                className="h-11 rounded-xl"
              />
            </div>
          )}
        />

        <form.Field
          name="url"
          validators={{
            onSubmit: createPlatformSchema.shape.url,
          }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Official Portal URL</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://www.netflix.com"
                className="h-11 rounded-xl font-mono text-sm"
              />
              {field.state.meta.errors.length > 0 ? (
                <em className="text-[11px] text-destructive leading-tight block">
                  {field.state.meta.errors[0].message}
                </em>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className={isModal ? "pt-6 flex justify-end gap-3" : "pt-8 border-t border-border flex gap-4"}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel || (() => router.back())}
          disabled={isLoading}
          className="h-11 rounded-xl px-6"
        >
          {isModal ? "Cancel" : <><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</>}
        </Button>
        <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-xl gap-2 min-w-[140px] shadow-lg shadow-primary/10">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isEditing ? "Update Portal" : "Register Provider"}
        </Button>
      </div>
    </form>
  );
};
