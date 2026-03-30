"use client";

import { JsonImportModal } from "@/components/Shared/JsonEditor/JsonImportModal";
import { Button } from "@/components/ui/button";
import { adminCreateMediaBulk } from "@/services/admin.service";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function MediaJsonAddDialog() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { mutateAsync: createMediaBulk, isPending: isCreatingMediaBulk } =
    useMutation({
      mutationKey: ["media-bulk-import"],
      mutationFn: (data: any) => adminCreateMediaBulk(data),
      onSuccess: () => {
        setIsImportModalOpen(false);
      },
    });

  // 2. Define the import action
  const handleBulkImport = async (data: any) => {
    console.log("Importing:", data);
    const res = await createMediaBulk(data);
    console.log("Bulk Import Response:", res);
  };

  return (
    <>
      <Button size={"lg"} onClick={() => setIsImportModalOpen(true)}>
        <Plus />
        Import JSON
      </Button>
      <JsonImportModal
        title="Bulk Import Media"
        description="Paste an array of media objects to import multiple titles at once."
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleBulkImport}
        isLoading={false}
      />
    </>
  );
}
