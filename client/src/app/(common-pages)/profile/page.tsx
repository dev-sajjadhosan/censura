import ProfileClient from "@/components/Modules/Profile/ProfileClient";
import { getCurrentUser } from "@/services/user.service";
import { ProfileMenu } from "@/types/default.types";

const ProfileMenus: ProfileMenu[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: "User2",
  },
  {
    title: "Watchlist",
    href: "/profile/watchlist",
    icon: "ListVideo",
  },
  {
    title: "Bookmarks",
    href: "/profile/bookmarks",
    icon: "Bookmark",
  },
  {
    title: "Favorites",
    href: "/profile/favorites",
    icon: "Star",
  },
  {
    title: "Settings",
    href: "/profile/settings",
    icon: "Settings",
  },
  {
    title: "Subscription",
    href: "/subscription",
    icon: "CreditCard",
  },
  {
    type: "divider",
  },
  {
    title: "Logout",
    href: "/logout",
    icon: "LogOut",
  },
];

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <ProfileClient user={user} />
  );
}
