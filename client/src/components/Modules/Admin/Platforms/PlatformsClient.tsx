"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminGetAllPlatforms, adminDeletePlatform } from "@/services/admin.service";
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

export const PlatformsClient = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tableState = useServerManagedDataTable({ searchParams });

  // Modal states
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [deletingPlatform, setDeletingPlatform] = useState<Platform | null>(null);

  // Data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["admin-platforms", tableState.queryStringFromUrl],
    queryFn: () => adminGetAllPlatforms(tableState.queryStringFromUrl),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeletePlatform(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      toast.success("Platform removed successfully");
      setDeletingPlatform(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove platform");
    },
  });

  const platforms = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta || { total: 0, page: 1, limit: 10, totalPage: 1 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-8 border border-border bg-card rounded-[2rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none -rotate-12 scale-110">
          <Globe className="h-32 w-32" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            <span>Admin</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/80">Streaming Integrations</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Streaming Portals</h1>
          <p className="text-muted-foreground text-sm max-w-xl font-medium">
            Integrate external streaming platforms. Link existing media to their homes across the web with direct portal integration.
          </p>
        </div>
        
        <Button asChild className="gap-3 h-12 px-8 shadow-xl shadow-primary/15 rounded-2xl relative z-10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
          <Link href="/admin/platforms/create">
            <Plus className="h-5 w-5" />
            Register Portal
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-[2rem] p-3 shadow-md">
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
      <AlertDialog
        open={!!deletingPlatform}
        onOpenChange={(open) => !open && setDeletingPlatform(null)}
      >
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-10 space-y-8">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-3xl font-bold tracking-tight">Unlink Streaming Portal?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed">
                This will remove <span className="font-bold text-foreground">"{deletingPlatform?.platform}"</span> from the integration index. 
                Any media items referencing this portal will lose their outbound streaming links. This action can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-6 flex gap-4">
              <AlertDialogCancel className="h-12 rounded-2xl w-full sm:w-auto font-semibold">Keep Portal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 px-10 rounded-2xl w-full sm:w-auto shadow-lg shadow-destructive/20 font-bold"
                onClick={() => deletingPlatform && deleteMutation.mutate(deletingPlatform.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Unlinking..." : "Confirm Removal"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
