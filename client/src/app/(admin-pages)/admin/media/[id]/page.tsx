export const dynamic = 'force-dynamic'

import MediaForm from "@/components/Modules/Admin/Media/MediaForm";
import { adminGetMediaById } from "@/services/admin.service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Media | Censura Admin",
  description: "Edit movie or series details.",
};

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let media: any = null;
  try {
    const res = (await adminGetMediaById(id)) as any;
    media = res?.data;
  } catch {
    return notFound();
  }

  if (!media) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl  tracking-tight">Edit Media</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Editing: <span className="font-medium">{media.title}</span>
        </p>
      </div>

      <MediaForm initialData={media} isEditing={true} />
    </div>
  );
}
