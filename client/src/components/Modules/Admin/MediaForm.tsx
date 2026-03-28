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
import { adminCreateMedia, adminUpdateMedia } from "@/services/admin.service";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  createMediaValidationSchema,
  CreateMediaValidationType,
} from "@/zod/media.validation";
import AppField from "@/components/Shared/Form/AppField";
import { Separator } from "@/components/ui/separator";

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

const PLATFORM_OPTIONS = [
  "NETFLIX",
  "DISNEY_PLUS",
  "HBO",
  "AMAZON_PRIME",
  "APPLE_TV_PLUS",
  "HULU",
  "PARAMOUNT_PLUS",
  "OTHER",
];

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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateMediaValidationType) =>
      adminCreateMedia(payload),
  });

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      synopsis: initialData?.synopsis || "",
      type: initialData?.type || "MOVIE",
      release: initialData?.release || new Date().getFullYear(),
      director: initialData?.director || "",
      poster: initialData?.poster || "",
      backdrop: initialData?.backdrop || "",
      trailer: initialData?.trailer || "",
      cast: initialData?.cast || [],
      streaming: initialData?.streaming || "",
      runtime: initialData?.runtime || 0,
      seasons: initialData?.seasons || 0,
      pricing: initialData?.pricing || "FREE",
      isPublished: initialData?.isPublished ?? false,
      isFeatured: initialData?.isFeatured ?? false,
    },
    onSubmit: async ({ value }) => {
      try {
        setSaving(true);
        const res = await mutateAsync(value);
        toast.success("Media created successfully");
        router.push("/admin/media");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message || "Failed to save media");
      } finally {
        setSaving(false);
      }
    },
  });

  const [castInput, setCastInput] = useState("");
  const [castMembers, setCastMembers] = useState<
    { name: string; role: string }[]
  >(
    initialData?.cast?.map((c: any) => ({
      name: c.name || c,
      role: c.role || "Actor",
    })) || [],
  );

  const [platformInput, setPlatformInput] = useState({
    platform: "NETFLIX",
    url: "",
  });
  const [platforms, setPlatforms] = useState<
    { platform: string; url: string }[]
  >(
    initialData?.platforms?.map((p: any) => ({
      platform: p.platform,
      url: p.url || "",
    })) || [],
  );

  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState<string[]>(
    initialData?.genres?.map((g: any) => g.name || g) || [],
  );

  const addCastMember = () => {
    if (!castInput.trim()) return;
    setCastMembers((prev) => [
      ...prev,
      { name: castInput.trim(), role: "Actor" },
    ]);
    setCastInput("");
  };

  const removeCast = (idx: number) => {
    setCastMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const addPlatform = () => {
    if (!platformInput.platform) return;
    setPlatforms((prev) => [...prev, { ...platformInput }]);
    setPlatformInput({ platform: "NETFLIX", url: "" });
  };

  const removePlatform = (idx: number) => {
    setPlatforms((prev) => prev.filter((_, i) => i !== idx));
  };

  const addGenre = () => {
    if (!genreInput.trim() || genres.includes(genreInput.trim())) return;
    setGenres((prev) => [...prev, genreInput.trim()]);
    setGenreInput("");
  };

  const removeGenre = (idx: number) => {
    setGenres((prev) => prev.filter((_, i) => i !== idx));
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 space-y-2">
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
                    onChange={(e) => field.handleChange(e.target.value)}
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
              name="release"
              validators={{
                onChange: createMediaValidationSchema.shape.release,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="year">Release Year</Label>
                  <Input
                    id="year"
                    type="number"
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
              name="runtime"
              validators={{
                onChange: createMediaValidationSchema.shape.runtime,
              }}
              children={(field) => (
                <>
                  <Label htmlFor="runtime">Runtime (minutes)</Label>
                  <Input
                    id="runtime"
                    type="number"
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
                    type="number"
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
      {/* Media URLs */}
      <section className="space-y-5">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <ImageIcon className="size-4" />
          Media URLs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <form.Field
              name="poster"
              validators={{
                onChange: createMediaValidationSchema.shape.poster,
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
              name="backdrop"
              validators={{
                onChange: createMediaValidationSchema.shape.backdrop,
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
              name="trailer"
              validators={{
                onChange: createMediaValidationSchema.shape.trailer,
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
              name="streaming"
              validators={{
                onChange: createMediaValidationSchema.shape.streaming,
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
      {/* Genres */}
      <section className="space-y-4">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Tag className="size-4" />
          Genres
        </h3>
        <div className="flex gap-2">
          <Input
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            placeholder="Add a genre"
            className="text-sm max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addGenre();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addGenre}>
            <Plus className="size-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((g, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-destructive/10"
              onClick={() => removeGenre(idx)}
            >
              {g}
              <X className="size-3" />
            </Badge>
          ))}
        </div>
      </section>

      {/* Cast */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Cast Members
        </h3>
        <div className="flex gap-2">
          <Input
            value={castInput}
            onChange={(e) => setCastInput(e.target.value)}
            placeholder="Actor name"
            className="text-sm max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCastMember();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCastMember}
          >
            <Plus className="size-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {castMembers.map((c, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-destructive/10"
              onClick={() => removeCast(idx)}
            >
              {c.name} ({c.role})
              <X className="size-3" />
            </Badge>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Link2 className="size-4 inline mr-2" />
          Streaming Platforms
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Select
            value={platformInput.platform}
            onValueChange={(v) =>
              setPlatformInput((prev) => ({ ...prev, platform: v }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={platformInput.url}
            onChange={(e) =>
              setPlatformInput((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="Platform URL (optional)"
            className="text-sm max-w-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPlatform}
          >
            <Plus className="size-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {platforms.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2"
            >
              <div>
                <span className="text-sm font-medium">
                  {p.platform.replace(/_/g, " ")}
                </span>
                {p.url && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {p.url}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-500 hover:bg-red-500/10"
                onClick={() => removePlatform(idx)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          size={"lg"}
          onClick={() => router.push("/admin/media")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving} size={"lg"}>
          {saving ? (
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
