import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getIconComponent } from "@/lib/iconMapper";
import { getCurrentUser } from "@/services/user.service";
import { ProfileMenu } from "@/types/default.types";
import { ArrowBigLeftDash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    href: "/profile/subscription",
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
  // console.log(user);
  return (
    <div className="flex h-screen w-full gap-10 p-10">
      <div className="flex flex-col justify-between gap-5 w-md h-full bg-secondary/40 p-5 rounded-xl">
        <div className="flex flex-col">
          <span className="w-10 h-px bg-primary/20 mt-1" />
          <span className="w-20 h-px bg-primary/30 mt-1" />
          <span className="w-30 h-px bg-primary/40 mt-1" />
        </div>
        <div className="bg-secondary/45 hover:bg-secondary/60 w-full h-full p-10 rounded-xl flex gap-3 items-center justify-center group">
          <ArrowBigLeftDash className="size-7 group-hover:-translate-x-2 transition-all duration-100" />
          <Link href="/" className="text-3xl">
            Back
          </Link>
        </div>
        <div className="w-full">
          <h3 className="text-sm text-muted-foreground mb-1">
            Profile Actions
          </h3>
          {ProfileMenus.map((menu: ProfileMenu, i: number) => {
            const Icon = getIconComponent(menu?.icon ?? "");
            return (
              <div key={i} className="w-full">
                {menu?.type === "divider" ? (
                  <span className="w-full h-px bg-primary/45 block mt-5 mb-2" />
                ) : (
                  <Link
                    href={menu?.href ?? "#"}
                    className="flex items-center justify-between py-3.5 px-5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary group"
                  >
                    <Icon className="size-5 group-hover:scale-110 transition-all duration-100" />
                    <h1 className="text-md">{menu.title}</h1>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex gap-11 w-full h-full mt-11">
          <Avatar className="size-70">
            <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />
            <AvatarFallback className="text-9xl">
              {(user?.name as string)?.split(" ")[0][0]}
              {(user?.name as string)?.split(" ")[1][0]}
              {(user?.name as string)?.split(" ")[2][0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1 mt-9">
            <Badge className="px-5 py-3 mb-3"> {user?.role || "DEFAULT"}</Badge>
            <h1 className="text-2xl font-bold">
              {user?.name || "Default Name"}
            </h1>
            <h3 className="font-medium text-muted-foreground">
              {user?.email || "default.example@gmail.com"}
            </h3>
            {/* <p> {user?.profile.bio || "No bio available"}</p> */}
            <p className="text-xs mt-3 text-muted-foreground">
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
              ducimus. Debitis iste possimus itaque, laudantium tempore eos
              suscipit aliquid repudiandae, eveniet doloremque provident natus
              architecto sequi hic minima modi nam porro! Dicta labore
              reiciendis eos necessitatibus maxime praesentium facilis aliquam,
              explicabo earum, impedit
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="">Your Activity</h3>
          <div className="flex items-center gap-5">
            {Object.entries(user?.meta || {}).map(([key, value], i) => (
              <div
                key={i}
                className="flex gap-3 items-center justify-center hover:bg-secondary px-5 py-3 rounded-lg border border-secondary/35"
              >
                <h1 className="text-xl">{value}</h1>
                <p className="text-sm text-muted-foreground">{key}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mt-5">
          <ScrollArea className="w-4xl whitespace-nowrap p-4 mx-auto">
            <div className="flex w-max gap-4">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <Card key={i} className="w-40 p-0 shrink-0 overflow-hidden">
                  <CardContent className="p-0 relative">
                    <img
                      src="https://github.com/shadcn.png"
                      alt="Movie Poster"
                      width={300}
                      height={300}
                      className="aspect-square object-cover"
                    />
                    <Badge className="absolute bottom-1 left-2">
                      CARD TITLE
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
