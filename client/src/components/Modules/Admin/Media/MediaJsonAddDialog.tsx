"use client";

import { JsonImportModal } from "@/components/Shared/JsonEditor/JsonImportModal";
import { Button } from "@/components/ui/button";
import { adminCreateMediaBulk } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Braces, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function MediaJsonAddDialog() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { mutateAsync: createMediaBulk, isPending } = useMutation({
    mutationKey: ["media-bulk-import"],
    mutationFn: (data: any) => adminCreateMediaBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-medias"] });
      router.refresh();
      router.push("/admin/media");
      setIsImportModalOpen(false);
      toast.success("Media imported successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleBulkImport = async (data: any) => {
    const res = await createMediaBulk(data);
  };

  return (
    <>
      <Button size={"lg"} onClick={() => setIsImportModalOpen(true)}>
        <Braces />
        Import JSON
      </Button>
      <JsonImportModal
        title="Bulk Import Media"
        description="Paste an array of media objects to import multiple titles at once."
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleBulkImport}
        isLoading={isPending}
      />
    </>
  );
}
