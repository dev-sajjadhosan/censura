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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { adminCreateMedia, adminUpdateMedia } from "@/services/admin.service";

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

  const [form, setForm] = useState({
    title: initialData?.title || "",
    synopsis: initialData?.synopsis || "",
    type: initialData?.type || "MOVIE",
    releaseYear: initialData?.releaseYear || new Date().getFullYear(),
    director: initialData?.director || "",
    posterUrl: initialData?.posterUrl || "",
    backdropUrl: initialData?.backdropUrl || "",
    trailerUrl: initialData?.trailerUrl || "",
    streamingUrl: initialData?.streamingUrl || "",
    runtimeMinutes: initialData?.runtimeMinutes || 0,
    seasons: initialData?.seasons || 0,
    pricing: initialData?.pricing || "FREE",
    isPublished: initialData?.isPublished ?? false,
    isFeatured: initialData?.isFeatured ?? false,
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

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        releaseYear: Number(form.releaseYear),
        runtimeMinutes: Number(form.runtimeMinutes),
        seasons: Number(form.seasons),
        cast: castMembers,
        platforms,
        genres,
      };

      if (isEditing && initialData?.id) {
        await adminUpdateMedia(initialData.id, payload);
        toast.success("Media updated successfully");
      } else {
        await adminCreateMedia(payload);
        toast.success("Media created successfully");
      }
      router.push("/admin/media");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save media");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter media title"
              className="text-sm"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea
              id="synopsis"
              value={form.synopsis}
              onChange={(e) => updateField("synopsis", e.target.value)}
              placeholder="Enter synopsis / description"
              rows={4}
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => updateField("type", v)}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Release Year</Label>
            <Input
              id="year"
              type="number"
              value={form.releaseYear}
              onChange={(e) => updateField("releaseYear", e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="director">Director</Label>
            <Input
              id="director"
              value={form.director}
              onChange={(e) => updateField("director", e.target.value)}
              placeholder="Director name"
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="runtime">Runtime (minutes)</Label>
            <Input
              id="runtime"
              type="number"
              value={form.runtimeMinutes}
              onChange={(e) => updateField("runtimeMinutes", e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seasons">Seasons</Label>
            <Input
              id="seasons"
              type="number"
              value={form.seasons}
              onChange={(e) => updateField("seasons", e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Pricing</Label>
            <Select
              value={form.pricing}
              onValueChange={(v) => updateField("pricing", v)}
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
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={form.isPublished}
              onCheckedChange={(v) => updateField("isPublished", v)}
            />
            <Label htmlFor="published" className="text-sm cursor-pointer">
              Published
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={form.isFeatured}
              onCheckedChange={(v) => updateField("isFeatured", v)}
            />
            <Label htmlFor="featured" className="text-sm cursor-pointer">
              Featured
            </Label>
          </div>
        </div>
      </section>

      {/* Media URLs */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <ImageIcon className="size-4 inline mr-2" />
          Media URLs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="posterUrl">Poster URL</Label>
            <Input
              id="posterUrl"
              value={form.posterUrl}
              onChange={(e) => updateField("posterUrl", e.target.value)}
              placeholder="https://..."
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backdropUrl">Backdrop URL</Label>
            <Input
              id="backdropUrl"
              value={form.backdropUrl}
              onChange={(e) => updateField("backdropUrl", e.target.value)}
              placeholder="https://..."
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trailerUrl">Trailer URL</Label>
            <Input
              id="trailerUrl"
              value={form.trailerUrl}
              onChange={(e) => updateField("trailerUrl", e.target.value)}
              placeholder="YouTube trailer URL"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="streamingUrl">Streaming URL (YouTube)</Label>
            <Input
              id="streamingUrl"
              value={form.streamingUrl}
              onChange={(e) => updateField("streamingUrl", e.target.value)}
              placeholder="YouTube streaming link"
              className="text-sm"
            />
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
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
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
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
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
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
          variant="outline"
          onClick={() => router.push("/admin/media")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
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
