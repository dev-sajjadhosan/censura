"use client";

import { GenreForm } from "@/components/Modules/Admin/Genres/GenreForm";
import { ChevronLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GenreJsonAddDialog from "@/components/Modules/Admin/Genres/GenreJsonAddDialog";

export default function CreateGenrePage() {
  return (
    <div className="  px-4 space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2">
            <Tag className="size-7" />
          </div>
          <div>
            <h1 className="text-xl tracking-tight">Create New Genre</h1>
            <p className="text-muted-foreground mt-1 text-sm tracking-wide uppercase font-medium">
              Define a category for discovery and filtering
            </p>
          </div>
        </div>
        <GenreJsonAddDialog />
      </div>

      <div className="w-9/12 mx-auto mt-22">
        <GenreForm onSuccess={() => {}} onCancel={() => {}} />
      </div>
    </div>
  );
}
