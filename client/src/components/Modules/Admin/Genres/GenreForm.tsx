"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { adminCreateGenre, adminUpdateGenre } from "@/services/admin.service";
import { createGenreSchema, UpdateGenreInput } from "@/zod/genre.validation";
import { toast } from "sonner";
import { Genre } from "@/types/media.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export const GenreForm = ({
  initialData,
  onSuccess,
  onCancel,
  isModal,
}: {
  initialData?: Genre | null;
  onSuccess: () => void;
  onCancel: () => void;
  isModal?: boolean;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Mutations
  const { mutateAsync: createMutateAsync, isPending: createIsPending } =
    useMutation({
      mutationFn: (payload: any) => adminCreateGenre(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-genres"] });
      },
    });

  const { mutateAsync: updateMutateAsync, isPending: updateIsPending } =
    useMutation({
      mutationFn: (payload: any) => adminUpdateGenre(initialData?.id!, payload),
    });

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      isPublished: initialData?.isPublished || true,
      isFeatured: initialData?.isFeatured || false,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isModal) {
          const res = await updateMutateAsync(value);
          console.log("genre admin-update response: ", res);
          if (res.success) {
            toast.success("Genre updated successfully");
            return onSuccess();
          } else {
            toast.error(res.message || "Failed to update genre");
          }
        } else {
          const res = await createMutateAsync(value);
          console.log("genre admin-create response: ", res);
          if (res.success) {
            toast.success("Genre created successfully");
            return router.push("/admin/genres");
          } else {
            toast.error(res.message || "Failed to create genre");
          }
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to create genre");
      }
    },
  });

  return (
    <form
      className="space-y-6"
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
                onSubmit: createGenreSchema.shape.name,
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Genre Name *</Label>
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
                    placeholder="e.g. Science Fiction"
                    className="h-11"
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
                onSubmit: createGenreSchema.shape.slug,
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
                    placeholder="e.g. sci-fi"
                    className="h-11 font-mono text-sm"
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

          <form.Field
            name="image"
            validators={{
              onSubmit: createGenreSchema.shape.image,
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
                  className="h-11"
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
              onSubmit: createGenreSchema.shape.description,
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
                  placeholder="Provide a brief description of this category..."
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
                Make this genre visible to public users.
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
              <Label className="text-sm">Featured Genre</Label>
              <p className="text-xs text-muted-foreground">
                Highlight this genre in the discovery section.
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
            Create Genre
          </Button>
        )}
      </div>
    </form>
  );
};
