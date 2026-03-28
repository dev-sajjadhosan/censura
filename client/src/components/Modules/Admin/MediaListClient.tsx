"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Film,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminGetAllMedia,
  adminDeleteMedia,
  adminToggleMediaPublish,
} from "@/services/admin.service";

const MEDIA_TYPES = [
  "ALL",
  "MOVIE",
  "SERIES",
  "DRAMA",
  "ANIME",
  "DOCUMENTARY",
  "TV_SHOW",
  "WEB_SERIES",
];

export default function AdminMediaListClient() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.searchTerm = search;
      if (typeFilter !== "ALL") params.type = typeFilter;
      const res = (await adminGetAllMedia(params)) as any;
      setMedia(res?.data || []);
    } catch {
      // gracefully handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [typeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedia();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setActionLoading(id);
      await adminDeleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
      toast.success(`"${title}" deleted`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePublish = async (
    id: string,
    currentPublished: boolean,
  ) => {
    try {
      setActionLoading(id);
      await adminToggleMediaPublish(id, !currentPublished);
      setMedia((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, isPublished: !currentPublished } : m,
        ),
      );
      toast.success(currentPublished ? "Unpublished" : "Published");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all movies, series, and content.
          </p>
        </div>
        <Link href="/admin/media/new">
          <Button>
            <Plus className="size-4 mr-1" />
            Add Media
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="pl-9 text-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="size-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEDIA_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "ALL" ? "All Types" : t.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-border rounded-xl">
          <Film className="size-10 text-muted-foreground" />
          <p className="font-medium">No media found</p>
          <p className="text-sm text-muted-foreground">
            Start by adding a new movie or series.
          </p>
          <Link href="/admin/media/new">
            <Button variant="outline" size="sm">
              <Plus className="size-3 mr-1" />
              Add Media
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span className="col-span-4">Title</span>
            <span className="col-span-1">Type</span>
            <span className="col-span-1">Year</span>
            <span className="col-span-1">Pricing</span>
            <span className="col-span-1">Rating</span>
            <span className="col-span-1">Reviews</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {media.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors text-sm"
              >
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  {item.posterUrl ? (
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-8 h-11 rounded object-cover shrink-0 border border-border"
                    />
                  ) : (
                    <div className="w-8 h-11 rounded bg-muted flex items-center justify-center shrink-0">
                      <Film className="size-3 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.director || "—"}
                    </p>
                  </div>
                </div>
                <div className="col-span-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <div className="col-span-1 text-muted-foreground">
                  {item.releaseYear || "—"}
                </div>
                <div className="col-span-1">
                  <Badge
                    className={
                      item.pricing === "FREE"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                        : item.pricing === "PREMIUM"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs"
                    }
                  >
                    {item.pricing}
                  </Badge>
                </div>
                <div className="col-span-1 flex items-center gap-1 text-amber-500">
                  <Star className="size-3 fill-amber-500" />
                  <span className="text-xs">
                    {item.avgRating?.toFixed(1) || "—"}
                  </span>
                </div>
                <div className="col-span-1 text-muted-foreground text-xs">
                  {item.reviewCount || 0}
                </div>
                <div className="col-span-1">
                  <Badge
                    className={
                      item.isPublished
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                        : "bg-red-500/10 text-red-500 border-red-500/20 text-xs"
                    }
                  >
                    {item.isPublished ? "Live" : "Draft"}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={actionLoading === item.id}
                    onClick={() =>
                      handleTogglePublish(item.id, item.isPublished)
                    }
                    title={item.isPublished ? "Unpublish" : "Publish"}
                  >
                    {item.isPublished ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </Button>
                  <Link href={`/admin/media/${item.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Edit"
                    >
                      <Edit className="size-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                    disabled={actionLoading === item.id}
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
