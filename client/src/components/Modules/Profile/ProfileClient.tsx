"use client";
import SubscriptionBadge from "@/components/Modules/Profile/SubscriptionBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getIconComponent } from "@/lib/iconMapper";
import { IProfileResponse } from "@/types/auth.types";
import { ProfileMenu } from "@/types/default.types";
import { Clapperboard, Eye, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export type ProfileTab = "bookmarks" | "favorites" | "watchlists";

const ProfileMenus: ProfileMenu[] = [
  { title: "Profile", href: "/profile", icon: "User2" },
  { title: "Collections", href: "/profile/collections", icon: "ListVideo" },
  { title: "Settings", href: "/profile/settings", icon: "Settings" },
  { title: "Subscription", href: "/profile/subscription", icon: "CreditCard" },
  { title: "My Media Purchases", href: "/profile/my-media-purchases", icon: "CreditCard" },
  { type: "divider" },
  { title: "Logout", href: "/logout", icon: "LogOut" },
];
const MobileNavMenus = ProfileMenus.filter(
  (m) => m.type !== "divider" && m.title !== "Logout"
);

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />

      <div className="relative flex items-center justify-around px-2 py-2 safe-area-pb">
        {/* Home button */}
        <Link href="/" className="group flex flex-col items-center gap-1 px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 group-hover:bg-primary/10">
            <Home className="size-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">Home</span>
        </Link>

        {/* Dynamic profile nav items */}
        {MobileNavMenus.map((menu) => {
          const Icon = getIconComponent(menu?.icon ?? "");
          const isActive = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href ?? "#"}
              className="group relative flex flex-col items-center gap-1 px-3 py-1.5"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <Icon className="size-4.5" />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {menu.title}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-dot"
                  className="absolute -top-0.5 h-1 w-4 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        {/* Logout — kept separate with destructive styling */}
        <Link
          href="/logout"
          className="group flex flex-col items-center gap-1 px-3 py-1.5"
        >
          {(() => {
            const LogoutIcon = getIconComponent("LogOut");
            return (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 group-hover:bg-destructive/10">
                  <LogoutIcon className="size-4.5 text-muted-foreground group-hover:text-destructive transition-colors" />
                </div>
                <span className="text-[10px] text-muted-foreground group-hover:text-destructive font-medium transition-colors">
                  Logout
                </span>
              </>
            );
          })()}
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProfileClient({
  user,
}: {
  user: IProfileResponse | null;
}) {
  const [tab, setTab] = useState<ProfileTab>("bookmarks");

  return (
    <>
      <div className="flex min-h-screen w-full gap-10 p-7 pb-24 md:pb-7">
        {/* ── Left sidebar — hidden on mobile ── */}
        <div className="hidden md:flex flex-col justify-between gap-5 w-md h-full bg-secondary/40 p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="w-10 h-px bg-primary/20 mt-1" />
              <span className="w-20 h-px bg-primary/30 mt-1" />
              <span className="w-30 h-px bg-primary/40 mt-1" />
            </div>
            <Link href={"/"}>
              <Button size={"icon-lg"} variant={"ghost"} className="rounded-full">
                <Home />
              </Button>
            </Link>
          </div>

          <SubscriptionBadge subscription={user?.subscription ?? null} />

          <div className="w-full">
            <h3 className="text-sm text-muted-foreground mb-1">Profile Actions</h3>
            {ProfileMenus.map((menu: ProfileMenu, i: number) => {
              const Icon = getIconComponent(menu?.icon ?? "");
              return (
                <div key={i} className="w-full">
                  {menu?.type === "divider" ? (
                    <span className="w-full h-px bg-primary/45 block mt-5 mb-2" />
                  ) : (
                    <Link
                      href={menu?.href ?? "#"}
                      className="flex items-center justify-between py-3 px-5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary text-sm"
                    >
                      <Icon className="size-5 transition-all duration-100" />
                      {menu.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col md:flex-row md:gap-11 w-full h-full mt-11">
            <Avatar className="size-70">
              <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />
              <AvatarFallback className="text-9xl">
                {(user?.name as string)?.split(" ")[0][0]}
                {(user?.name as string)?.split(" ")[1]?.[0] || ""}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 mt-9">
              <Badge className="px-5 py-3 mb-3">{user?.role || "DEFAULT"}</Badge>
              <h1 className="text-2xl font-bold">{user?.name || "Default Name"}</h1>
              <h3 className="font-medium text-muted-foreground">
                {user?.email || "default.example@gmail.com"}
              </h3>
              <p className="text-xs mt-3 text-muted-foreground">
                {user?.profile?.bio || "No bio available"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <h3>Your Activity</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 items-center gap-5">
              {Object.entries(user?.meta || {}).map(([key, value], i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-center justify-center hover:bg-secondary px-5 py-3 rounded-lg border cursor-pointer ${
                    tab === key ? "border-secondary bg-secondary" : "border-secondary/35"
                  }`}
                  onClick={() => setTab(key as ProfileTab)}
                >
                  <h1 className="text-xl">{value}</h1>
                  <p className="text-sm text-muted-foreground">{key}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-5">
            <ScrollArea className="md:w-4xl whitespace-nowrap p-4 mx-auto">
              <div className="flex w-full gap-4">
                {user?.[tab]?.length === 0 ? (
                  <div className="flex flex-col items-center gap-1 justify-center w-md mx-auto h-30 bg-secondary/45 rounded-lg">
                    <Clapperboard className="size-7" />
                    <p className="text-muted-foreground">No {tab} found</p>
                  </div>
                ) : (
                  user?.[tab]?.map((item: any, i: number) => (
                    <Card key={i} className="w-40 p-0 shrink-0 overflow-hidden">
                      <CardContent className="p-0 relative">
                        <img
                          src={item?.media?.poster || "https://github.com/shadcn.png"}
                          alt="Movie Poster"
                          width={300}
                          height={300}
                          className="aspect-square object-cover"
                        />
                        <div className="flex items-center gap-5 absolute bottom-1 left-2">
                          <Badge>{item?.media?.title}</Badge>
                          <Link href={`/media/${item?.media?.slug}`}>
                            <Button size={"icon-sm"} variant={"ghost"} className="rounded-full">
                              <Eye />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav — only renders on small screens */}
      <MobileBottomNav />
    </>
  );
}