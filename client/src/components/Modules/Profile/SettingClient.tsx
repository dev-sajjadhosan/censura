"use client";

import DangerSection from "@/components/Modules/Profile/DangerSection";
import NotificationsSection from "@/components/Modules/Profile/NotificationSection";
import PasswordSection from "@/components/Modules/Profile/PasswordSection";
import PrivacySection from "@/components/Modules/Profile/PrivacySection";
import ProfileSection from "@/components/Modules/Profile/ProfileSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  IPasswordProps,
  IProfileProps,
  passwordSchema,
  profileSchema,
} from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  Bell,
  ChevronLeft,
  Eye,
  KeyRound,
  Loader,
  Lock,
  LogOut,
  Save,
  Shield,
  Trash2,
  User,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Section = "profile" | "password" | "notifications" | "privacy" | "danger";

const mockUser = {
  name: "Sajjad",
  username: "sajjad",
  email: "devsajjad@gmail.com",
  bio: "Cinephile. Always watching something.",
};

// ─── Sidebar nav config ──────────────────────────────────────────────────────

const navItems: {
  id: Section;
  label: string;
  icon: React.ElementType;
  danger?: boolean;
}[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "danger", label: "Delete Account", icon: Trash2, danger: true },
];

export default function SettingsClient({ user }: { user: any }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("profile");

  const sectionMap: Record<Section, React.ReactNode> = {
    profile: <ProfileSection user={user} />,
    password: <PasswordSection />,
    notifications: <NotificationsSection />,
    privacy: <PrivacySection />,
    danger: <DangerSection user={user} />,
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <nav className="flex flex-col gap-1">
              <Button
                className="my-3"
                variant={"ghost"}
                size={"lg"}
                onClick={() => router.back()}
              >
                <ChevronLeft /> Back
              </Button>
              {/* Groups */}
              {[
                { label: "Account", ids: ["profile", "password"] },
                { label: "Preferences", ids: ["notifications", "privacy"] },
                { label: "Danger", ids: ["danger"] },
              ].map((group) => (
                <div key={group.label} className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-1">
                    {group.label}
                  </p>
                  {navItems
                    .filter((n) => group.ids.includes(n.id))
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 my-1 rounded-lg text-sm transition-colors text-left ${
                          activeSection === item.id
                            ? "bg-accent text-foreground font-medium"
                            : item.danger
                              ? "text-red-400 hover:bg-red-500/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <item.icon
                          size={15}
                          className={
                            activeSection === item.id
                              ? "text-orange-500"
                              : item.danger
                                ? "text-red-400"
                                : ""
                          }
                        />
                        {item.label}
                      </button>
                    ))}
                </div>
              ))}
            </nav>
          </aside>
          <main className="md:col-span-3 p-5">{sectionMap[activeSection]}</main>
        </div>
      </div>
    </div>
  );
}
