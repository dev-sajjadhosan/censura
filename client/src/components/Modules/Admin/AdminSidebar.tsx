"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  MessageSquare,
  Users,
  BarChart3,
  LogOut,
  Shield,
  Clapperboard,
  Tag,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IProfileResponse } from "@/types/auth.types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "./Users/NavUser";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Media Library",
    href: "/admin/media",
    icon: Film,
    children: [
      {
        label: "Create Media",
        href: "/admin/media/create",
      },
      {
        label: "All Media",
        href: "/admin/media",
      },
    ],
  },
  {
    label: "Genres",
    href: "/admin/genres",
    icon: Tag,
    children: [
      {
        label: "Create Genre",
        href: "/admin/genres/create",
      },
      {
        label: "All Genres",
        href: "/admin/genres",
      },
    ],
  },
  {
    label: "Platforms",
    href: "/admin/platforms",
    icon: Clapperboard,
    children: [
      {
        label: "Create Platform",
        href: "/admin/platforms/create",
      },
      {
        label: "All Platforms",
        href: "/admin/platforms",
      },
    ],
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function AdminSidebar({ user }: { user: IProfileResponse }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* Header */}
      <SidebarHeader className="py-4 border-b border-border">
        <div className="flex items-center gap-3 px-2">
          <div>
            <SidebarTrigger className="-ml-1" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight leading-none">
                Censura
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest mt-0.5">
                Admin Panel
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href));

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.label}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.label}
                            isActive={isActive}
                            className={cn(
                              "h-10 transition-all duration-200",
                              isActive
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                            )}
                          >
                            {item.icon && (
                              <item.icon className="size-4.5 shrink-0" />
                            )}
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.label}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.href}
                                >
                                  <Link href={subItem.href}>
                                    <span>{subItem.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "h-10 transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4.5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border p-2 gap-2">
        <SidebarMenu>
          <NavUser user={user} />
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
