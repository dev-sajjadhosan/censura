"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllGenres, adminDeleteGenre } from "@/services/admin.service";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { GenresTable } from "./GenresTable";
import { Genre } from "@/types/media.types";
import { Button } from "@/components/ui/button";
import { Plus, Tag, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { UpdateGenreModal } from "./UpdateGenreModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GenreDeleteModal from "./GenreDeleteModal";

export const GenresClient = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tableState = useServerManagedDataTable({ searchParams });
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-genres", tableState.queryStringFromUrl],
    queryFn: () => getAllGenres(tableState.queryStringFromUrl),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-genres"] });
      toast.success("Genre deleted successfully");
      setDeletingGenre(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete genre");
    },
  });

  const genres = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  return (
    <div className="space-y-6 p-3">
      <div className="flex items-center justify-between">
        <div className="relative z-10 flex flex-col gap-1">
          <h1 className="text-2xl tracking-tight">Genre Management</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Organize discovery by managing genres. These values appear in
            filters and media details across the platform.
          </p>
        </div>

        <Button
          asChild
          className="gap-2 h-11 px-6 shadow-lg shadow-primary/10 rounded-xl relative z-10"
        >
          <Link href="/admin/genres/create">
            <Plus className="h-4.5 w-4.5" />
            Create Genre
          </Link>
        </Button>
      </div>

      <div>
        <GenresTable
          data={genres}
          meta={meta}
          isLoading={isLoading}
          onEdit={(genre) => setEditingGenre(genre)}
          onDelete={(genre) => setDeletingGenre(genre)}
        />
      </div>

      {/* Update Modal */}
      <UpdateGenreModal
        isOpen={!!editingGenre}
        onClose={() => setEditingGenre(null)}
        genre={editingGenre!}
      />

      <GenreDeleteModal
        deletingGenre={deletingGenre}
        deleteMutation={deleteMutation}
        setDeletingGenre={setDeletingGenre}
      />
    </div>
  );
};
