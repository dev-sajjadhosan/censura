import MediaListClient from "@/components/Modules/Admin/Media/MediaListClient";


export const metadata = {
  title: "Media Library | Censura Admin",
  description: "Manage all movies, series, and media content.",
};

export default function AdminMediaPage() {
  return <MediaListClient />;
}
