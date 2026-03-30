"use client";

import { JsonImportModal } from "@/components/Shared/JsonEditor/JsonImportModal";
import { Button } from "@/components/ui/button";
import { adminCreateGenreBulk } from "@/services/admin.service";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { Braces, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function GenreJsonAddDialog() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { mutateAsync: createGenreBulk, isPending } =
    useMutation({
      mutationKey: ["genre-bulk-import"],
      mutationFn: (data: any) => adminCreateGenreBulk(data),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["admin-genres"]})
        setIsImportModalOpen(false);
        router.refresh()
        router.push("/admin/genres")
        toast.success("Genres imported successfully")
      },
      onError: (error) => {
        toast.error(error.message)
      }
    });
  const handleBulkImport = async (data: any) => {
    console.log("Importing:", data);
    const res = await createGenreBulk(data);
    console.log("Bulk Import Response:", res);
  };

  return (
    <>
      <Button size={"lg"} onClick={() => setIsImportModalOpen(true)}>
        <Braces />
        Import JSON
      </Button>
      <JsonImportModal
        title="Bulk Import Genre"
        description="Paste an array of genre objects to import multiple genres at once."
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleBulkImport}
        isLoading={isPending}
      />
    </>
  );
}
