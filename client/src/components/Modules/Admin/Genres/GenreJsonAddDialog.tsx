"use client";

import { JsonImportModal } from "@/components/Shared/JsonEditor/JsonImportModal";
import { Button } from "@/components/ui/button";
import { adminCreateGenreBulk } from "@/services/admin.service";
import { useMutation } from "@tanstack/react-query";
import { Braces, Plus } from "lucide-react";
import { useState } from "react";

export default function GenreJsonAddDialog() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { mutateAsync: createGenreBulk, isPending } =
    useMutation({
      mutationKey: ["genre-bulk-import"],
      mutationFn: (data: any) => adminCreateGenreBulk(data),
      onSuccess: () => {
        setIsImportModalOpen(false);
      },
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
