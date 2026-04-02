"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Save } from "lucide-react";
import { toast } from "sonner";
import SectionHeader from "./SectionHeader";
import Toggle from "./ToggleSection";

export default function PrivacySection() {
  const [prefs, setPrefs] = useState({
    publicProfile: true,
    showWatchlist: true,
    showReviews: true,
    showActivity: false,
    allowMentions: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items = [
    {
      key: "publicProfile" as const,
      icon: Eye,
      title: "Public profile",
      desc: "Anyone can view your profile and reviews.",
    },
    {
      key: "showWatchlist" as const,
      icon: Eye,
      title: "Show watchlist",
      desc: "Make your watchlist visible to other users.",
    },
    {
      key: "showReviews" as const,
      icon: Eye,
      title: "Show reviews publicly",
      desc: "Your reviews appear on media pages for all users.",
    },
    {
      key: "showActivity" as const,
      icon: Eye,
      title: "Show recent activity",
      desc: "Display your recently watched titles on your profile.",
    },
    {
      key: "allowMentions" as const,
      icon: Eye,
      title: "Allow mentions",
      desc: "Other users can tag you in reviews and comments.",
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Privacy Settings"
        desc="Control who can see your profile, activity, and content."
      />
      <p className="text-sm text-orange-500 text-center my-4">
        We are working on it. Comming Soon!
      </p>
      <div className="border border-white/5 rounded-xl overflow-hidden mb-6">
        {items.map((item, i) => (
          <div
            key={item.key}
            className={`flex items-center justify-between px-5 py-4 ${
              i < items.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium mb-0.5">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Toggle
              enabled={prefs[item.key]}
              onChange={() => toggle(item.key)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="gap-2"
        onClick={() => toast.success("Privacy settings saved.")}
      >
        <Save size={15} />
        Save preferences
      </Button>
    </div>
  );
}
