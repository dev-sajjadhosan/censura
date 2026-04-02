export const dynamic = "force-dynamic";

import SettingsClient from "@/components/Modules/Profile/SettingClient";
import { getCurrentUser } from "@/services/user.service";

export default async function SettingsPage() {
  const user = await getCurrentUser()
  return (
    <>
      <SettingsClient user={user} />
    </>
  );
}