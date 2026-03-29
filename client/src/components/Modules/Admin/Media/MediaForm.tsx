"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Film,
  Plus,
  X,
  Save,
  Loader2,
  Link2,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  adminCreateMedia,
  adminGetAllGenres,
  adminUpdateMedia,
} from "@/services/admin.service";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMediaValidationSchema,
  CreateMediaValidationType,
} from "@/zod/media.validation";
import AppField from "@/components/Shared/Form/AppField";
import { Separator } from "@/components/ui/separator";
import { Genre, Platform } from "@/types/media.types";
import GenresInMedia from "./GenresInMedia";
import CastInMediaDialog from "./CastInMediaDialog";
import PlatfromInMedia from "./PlatfromInMedia";

const MEDIA_TYPES = [
  "MOVIE",
  "SERIES",
  "DRAMA",
  "ANIME",
  "CARTOON",
  "SHORT_FILM",
  "DOCUMENTARY",
  "TV_SHOW",
  "WEB_SERIES",
];

const PRICING_OPTIONS = ["FREE", "PREMIUM", "RENTAL"];

interface MediaFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function MediaForm({
  initialData,
  isEditing = false,
}: MediaFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: (payload: CreateMediaValidationType) =>
      adminCreateMedia(payload),
  });

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      synopsis: initialData?.synopsis || "",
      type: initialData?.type || "MOVIE",
      releaseYear: initialData?.releaseYear || new Date().getFullYear(),
      director: initialData?.director || "",
      posterUrl: initialData?.posterUrl || "",
      backdropUrl: initialData?.backdropUrl || "",
      trailerUrl: initialData?.trailerUrl || "",
      cast: initialData?.cast || [],
      genres: initialData?.genres || [],
      streamingUrl: initialData?.streamingUrl || "",
      runtimeMinutes: initialData?.runtimeMinutes || 0,
      seasons: initialData?.seasons || 0,
      pricing: initialData?.pricing || "FREE",
      isPublished: initialData?.isPublished ?? false,
      isFeatured: initialData?.isFeatured ?? false,
      platforms: initialData?.platforms || [],
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await mutateAsync(value);
        console.log("Media Payload", res);
        toast.success("Media created successfully");
        // router.push("/admin/media");
        // router.refresh();
      } catch (err: any) {
        toast.error("Failed to create media");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      noValidate
      className="space-y-8 w-9/12 mx-auto mt-15"
    >
      {/* Basic Info */}
      <section className="space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Basic Information
        </h3>

        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-center gap-5 w-full">
            <div className="space-y-2 w-full">
              <form.Field
                name="title"
                validators={{
                  onChange: createMediaValidationSchema.shape.title,
                }}
                children={(field) => (
                  <>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        const slug = e.target.value
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/[^\w-]+/g, "");
                        form.setFieldValue("slug", slug);
                      }}
                      placeholder="Enter media title"
                      className="text-sm"
                    />

                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="space-y-2 w-full">
              <form.Field
                name="slug"
                validators={{
                  onChange: createMediaValidationSchema.shape.slug,
                }}
                children={(field) => (
                  <>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter media slug"
                      className="text-sm"
                    />

                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <form.Field
              name="synopsis"
              validators={{
                onChange: createMediaValidationSchema.shape.synopsis,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="synopsis">Synopsis</Label>
                  <Textarea
                    id="synopsis"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter synopsis"
                    rows={7}
                    className="text-sm resize-none bg-secondary border-0 p-5"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <form.Field
              name="type"
              validators={{
                onChange: createMediaValidationSchema.shape.type,
              }}
              children={(field) => (
                <div className="flex flex-col gap-2 w-full">
                  <Label>Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDIA_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            />
            <form.Field
              name="pricing"
              validators={{
                onChange: createMediaValidationSchema.shape.pricing,
              }}
              children={(field) => (
                <div className="flex flex-col gap-2 w-full">
                  <Label>Pricing</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <form.Field
              name="releaseYear"
              validators={{
                onChange: createMediaValidationSchema.shape.releaseYear,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="year">Release Year</Label>
                  <Input
                    id="year"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <form.Field
              name="director"
              validators={{
                onChange: createMediaValidationSchema.shape.director,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="director">Director</Label>
                  <Input
                    id="director"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Director name"
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <form.Field
              name="runtimeMinutes"
              validators={{
                onChange: createMediaValidationSchema.shape.runtimeMinutes,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="runtime">Runtime (minutes)</Label>
                  <Input
                    id="runtime"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <form.Field
              name="seasons"
              validators={{
                onChange: createMediaValidationSchema.shape.seasons,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="seasons">Seasons</Label>
                  <Input
                    id="seasons"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex items-center justify-around gap-6 mt-6 h-12">
            <div className="flex items-center gap-2">
              <form.Field
                name="isPublished"
                children={(field) => (
                  <>
                    <Switch
                      id="published"
                      checked={field.state.value}
                      onCheckedChange={(v) => field.handleChange(v)}
                    />
                    <Label
                      htmlFor="published"
                      className={`text-sm cursor-pointer ${field.state.value ? "text-orange-500" : "text-muted-foreground"}`}
                    >
                      Published
                    </Label>
                  </>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <form.Field
                name="isFeatured"
                children={(field) => (
                  <>
                    <Switch
                      id="featured"
                      checked={field.state.value}
                      onCheckedChange={(v) => field.handleChange(v)}
                    />
                    <Label
                      htmlFor="featured"
                      className={`text-sm cursor-pointer ${field.state.value ? "text-orange-500" : "text-muted-foreground"}`}
                    >
                      Featured
                    </Label>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-5">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <ImageIcon className="size-4" />
          Media URLs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <form.Field
              name="posterUrl"
              validators={{
                onChange: createMediaValidationSchema.shape.posterUrl,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="poster">Poster URL</Label>
                  <Input
                    id="poster"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://..."
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="backdropUrl"
              validators={{
                onChange: createMediaValidationSchema.shape.backdropUrl,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="backdrop">Backdrop URL</Label>
                  <Input
                    id="backdrop"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://..."
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="trailerUrl"
              validators={{
                onChange: createMediaValidationSchema.shape.trailerUrl,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="trailer">Trailer URL</Label>
                  <Input
                    id="trailer"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="YouTube trailer URL"
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="streamingUrl"
              validators={{
                onChange: createMediaValidationSchema.shape.streamingUrl,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="streaming">Streaming URL (YouTube)</Label>
                  <Input
                    id="streaming"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="YouTube streaming link"
                    className="text-sm"
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </section>
      <Separator />

      <section className="space-y-4">
        <form.Field
          name="genres"
          validators={{
            onChange: createMediaValidationSchema.shape.genres,
          }}
          children={(field) => (
            <>
              <GenresInMedia field={field} />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </>
          )}
        />
      </section>

      <section className="space-y-4">
        <form.Field
          name="cast"
          validators={{
            onChange: createMediaValidationSchema.shape.cast,
          }}
          children={(field) => (
            <>
              <Label htmlFor="cast">Cast Members</Label>
              <CastInMediaDialog
                cast={field.state.value}
                setCast={field.handleChange}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </>
          )}
        />
      </section>
      <section className="space-y-4">
        <form.Field
          name="platforms"
          validators={{
            onChange: createMediaValidationSchema.shape.platforms,
          }}
          children={(field) => (
            <>
              <PlatfromInMedia field={field} />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </>
          )}
        />
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          size={"lg"}
          onClick={() => router.push("/admin/media")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} size={"lg"}>
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="size-4 mr-1" />
              {isEditing ? "Update Media" : "Create Media"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
