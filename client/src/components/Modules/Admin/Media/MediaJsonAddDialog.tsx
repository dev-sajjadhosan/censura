"use client";

import { JsonImportModal } from "@/components/Shared/JsonEditor/JsonImportModal";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function MediaJsonAddDialog() {
  // 1. Setup toggle state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  // const {} = useMutation({
  //     mutationKey: ["media-bulk-import"],
  //     mutationFn: (data: any) => createMediaBulk(data),
  //     onSuccess: () => {
  //         setIsImportModalOpen(false);
  //     }
  // })

  // 2. Define the import action
  const handleBulkImport = async (data: any) => {
    // data will be the parsed object or array
    console.log("Importing:", data);
    // your logic with createMutation.mutateAsync(data)
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
