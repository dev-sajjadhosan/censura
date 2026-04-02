export const dynamic = 'force-dynamic'

import { PlatformsClient } from "@/components/Modules/Admin/Platforms/PlatformsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Censura | Admin Portals",
  description: "Configure external streaming service integrations.",
};

export default function PlatformsPage() {
  return <PlatformsClient />;
}
