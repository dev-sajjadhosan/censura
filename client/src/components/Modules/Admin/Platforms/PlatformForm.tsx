"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import {
  adminCreatePlatform,
  adminUpdatePlatform,
} from "@/services/admin.service";
import {
  createPlatformSchema,
  UpdatePlatformInput,
} from "@/zod/platform.validation";
import { toast } from "sonner";
import { Platform } from "@/types/media.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save, Globe, ArrowLeft, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { mutateAsync: createPlatform, isPending: createIsPending } =
    useMutation({
      mutationFn: (payload: any) => adminCreatePlatform(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      },
    });

  const { mutateAsync: updatePlatform, isPending: updateIsPending } =
    useMutation({
      mutationFn: (payload: UpdatePlatformInput) =>
        adminUpdatePlatform(initialData?.id as string, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      },
    });

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
      type: initialData?.type || "FREE",
      icon: initialData?.icon || "",
      isPublished: initialData?.isPublished || true,
      isFeatured: initialData?.isFeatured || false,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const res = await updatePlatform(value as any);
        if (res.success) {
          toast.success("Platform updated successfully");
          if (onSuccess) onSuccess();
          if (!isModal) router.push("/admin/platforms");
        }
      } else {
        const res = await createPlatform(value as any);
        if (res.success) {
          toast.success("Platform registered successfully");
          if (onSuccess) onSuccess();
          if (!isModal) router.push("/admin/platforms");
        }
      }
    },
  });

  const isLoading = createIsPending || updateIsPending;

  return (
    <form
      className="space-y-6 w-9/12 mx-auto"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="name"
              validators={{
                onChange: createPlatformSchema.shape.name,
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Platform Name *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/[^\w-]+/g, "");
                      form.setFieldValue("slug", slug);
                    }}
                    placeholder="e.g. Netflix, Hulu, Disney+"
                    // className="h-11"
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <em className="text-[11px] text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </em>
                  ) : null}
                </div>
              )}
            />
            <form.Field
              name="slug"
              validators={{
                onChange: createPlatformSchema.shape.slug,
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>URL Slug *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. netflix, hulu, disney-plus"
                    // className="h-11 font-mono text-sm"
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <em className="text-[11px] text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </em>
                  ) : null}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="url"
              validators={{
                onChange: createPlatformSchema.shape.url,
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>URL *</Label>
                  <div className="flex items-center gap-1 bg-secondary/45 rounded-lg px-3">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-transparent"
                    />
                    <Button
                      size={"icon-lg"}
                      variant={"ghost"}
                      disabled={!field.state.value}
                      onClick={() => window.open(field.state.value, "_blank")}
                    >
                      <Link2 />
                    </Button>
                  </div>
                  {field.state.meta.errors.length > 0 ? (
                    <em className="text-[11px] text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </em>
                  ) : null}
                </div>
              )}
            />
            <form.Field
              name="type"
              validators={{
                onChange: createPlatformSchema.shape.type,
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Type *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="LIMITED_FREE">Limited Free</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="RENTAL">Rental</SelectItem>
                      <SelectItem value="BUY">Buy</SelectItem>
                      <SelectItem value="ONE_TIME">One Time</SelectItem>
                      <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                      <SelectItem value="FREE_WITH_ADS">Free with Ads</SelectItem>

                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 ? (
                    <em className="text-[11px] text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </em>
                  ) : null}
                </div>
              )}
            />
          </div>

          <form.Field
            name="icon"
            validators={{
              onChange: createPlatformSchema.shape.icon,
            }}
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Icon/Image URL</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com/image.png"
                  // className="h-11"
                />
                {field.state.meta.errors.length > 0 ? (
                  <em className="text-[11px] text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </em>
                ) : null}
              </div>
            )}
          />

          <form.Field
            name="description"
            validators={{
              onChange: createPlatformSchema.shape.description,
            }}
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={5}
                  placeholder="Provide a brief description of this platform..."
                  className="resize-none p-5"
                />
                {field.state.meta.errors.length > 0 ? (
                  <em className="text-[11px] text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </em>
                ) : null}
              </div>
            )}
          />
        </div>

        <div className="flex items-center gap-9 col-span-2">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-0.5">
              <Label className="text-sm">Visibility Status</Label>
              <p className="text-xs text-muted-foreground">
                Make this platform visible to public users.
              </p>
            </div>
            <form.Field
              name="isPublished"
              children={(field) => (
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked as any)
                  }
                />
              )}
            />
          </div>
          <Separator orientation="vertical" />
          <div className="flex items-center justify-between w-full">
            <div className="space-y-0.5">
              <Label className="text-sm">Featured Platform</Label>
              <p className="text-xs text-muted-foreground">
                Highlight this platform in the discovery section.
              </p>
            </div>
            <form.Field
              name="isFeatured"
              children={(field) => (
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-13 flex items-center justify-end gap-5">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel || (() => router.back())}
          className="h-11 px-6"
        >
          Back
        </Button>
        {initialData ? (
          <Button
            type="submit"
            disabled={updateIsPending}
            className="h-11 px-8 gap-2 min-w-[140px]"
          >
            {updateIsPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save />
            )}
            Update Genre
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={createIsPending}
            className="h-11 px-8 gap-2 min-w-[140px]"
          >
            {createIsPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus />
            )}
            Create Platform
          </Button>
        )}
      </div>
    </form>
  );
};
