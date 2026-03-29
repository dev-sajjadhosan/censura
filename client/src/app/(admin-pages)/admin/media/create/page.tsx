import MediaForm from "@/components/Modules/Admin/Media/MediaForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Add New Media | Censura Admin",
  description: "Add a new movie or series to the library.",
};

export default function NewMediaPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/media"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-xl tracking-tight">Add New Media</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new movie, series, or other content entry.
          </p>
        </div>
      </div>

      <MediaForm initialData={{}} />
    </div>
  );
}
