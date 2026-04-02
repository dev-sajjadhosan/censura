export const dynamic = "force-dynamic";
export const metadata = {
  title: "Media Platforms | Censura Admin",
  description: "Manage all media platforms where content is available.",
};

import { PlatformsClient } from "@/components/Modules/Admin/Platforms/PlatformsTable";

export default function PlatformsPage() {
  return <PlatformsClient />;
}
