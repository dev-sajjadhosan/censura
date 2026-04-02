export const dynamic = "force-dynamic";

import ProfileClient from "@/components/Modules/Profile/ProfileClient";
import { getCurrentUser } from "@/services/user.service";
import { ProfileMenu } from "@/types/default.types";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <ProfileClient user={user} />
  );
}
