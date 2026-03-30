"use client";

import { JsonImportModal } from "@/components/Shared/JsonEditor/JsonImportModal";
import { Button } from "@/components/ui/button";
import { adminCreatePlatformBulk } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Braces, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PlatformJsonAddDialog() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { mutateAsync: createPlatformBulk, isPending } = useMutation({
    mutationKey: ["platform-bulk-import"],
    mutationFn: (data: any) => adminCreatePlatformBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      setIsImportModalOpen(false);
      router.push("/admin/platforms");
      router.refresh();
      toast.success("Platforms imported successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleBulkImport = async (data: any) => {
    console.log("Importing:", data);
    const res = await createPlatformBulk(data);
    console.log("Bulk Import Response:", res);
  };

  return (
    <>
      <Button size={"lg"} onClick={() => setIsImportModalOpen(true)}>
        <Braces />
        Import JSON
      </Button>
      <JsonImportModal
        title="Bulk Import Platform"
        description="Paste an array of platform objects to import multiple platforms at once."
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleBulkImport}
        isLoading={isPending}
      />
    </>
  );
}
