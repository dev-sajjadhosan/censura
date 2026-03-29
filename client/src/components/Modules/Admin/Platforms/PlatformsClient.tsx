"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPlatforms, adminDeletePlatform } from "@/services/admin.service";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { PlatformsTable } from "./PlatformsTable";
import { Platform } from "@/types/media.types";
import { Button } from "@/components/ui/button";
import { Plus, Globe, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { UpdatePlatformModal } from "./UpdatePlatformModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PlatformDeleteModal from "./PlatformDeleteModal";

export const PlatformsClient = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tableState = useServerManagedDataTable({ searchParams });

  // Modal states
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [deletingPlatform, setDeletingPlatform] = useState<Platform | null>(
    null,
  );

  // Data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["admin-platforms", tableState.queryStringFromUrl],
    queryFn: () => getAllPlatforms(tableState.queryStringFromUrl),
  });

  console.log("platfrom data", data);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeletePlatform(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      toast.success("Platform removed successfully");
      setDeletingPlatform(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove platform",
      );
    },
  });

  const platforms = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-7">
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-2xl tracking-tight">Streaming Portals</h1>
          <p className="text-muted-foreground text-sm max-w-xl font-medium">
            Integrate external streaming platforms. Link existing media to their
            homes across the web with direct portal integration.
          </p>
        </div>

        <Button asChild size={"lg"}>
          <Link href="/admin/platforms/create">
            <Plus className="h-5 w-5" />
            Register Portal
          </Link>
        </Button>
      </div>

      <div>
        <PlatformsTable
          data={platforms}
          meta={meta}
          isLoading={isLoading}
          onEdit={(p) => setEditingPlatform(p)}
          onDelete={(p) => setDeletingPlatform(p)}
        />
      </div>

      {/* Update Modal */}
      <UpdatePlatformModal
        isOpen={!!editingPlatform}
        onClose={() => setEditingPlatform(null)}
        platform={editingPlatform}
      />

      {/* Delete confirmation dialog */}
      <PlatformDeleteModal
        deletingPlatform={deletingPlatform}
        setDeletingPlatform={setDeletingPlatform}
        deleteMutation={deleteMutation}
      />
    </div>
  );
};
