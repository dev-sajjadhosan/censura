"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import SectionHeader from "./SectionHeader";
import Toggle from "./ToggleSection";

export default function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    emailNewsletter: true,
    emailReviewReplies: true,
    emailNewFollower: false,
    emailEditorsPick: true,
    pushAll: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const groups = [
    {
      label: "Email notifications",
      items: [
        {
          key: "emailNewsletter" as const,
          title: "Daily digest",
          desc: "Morning roundup of new releases and Editor's Picks.",
        },
        {
          key: "emailReviewReplies" as const,
          title: "Review replies",
          desc: "When someone replies to your review or comment.",
        },
        {
          key: "emailNewFollower" as const,
          title: "New followers",
          desc: "When someone follows your profile.",
        },
        {
          key: "emailEditorsPick" as const,
          title: "Editor's Pick alerts",
          desc: "When a new title is hand-picked by our team.",
        },
      ],
    },
    {
      label: "Push notifications",
      items: [
        {
          key: "pushAll" as const,
          title: "Enable push notifications",
          desc: "Browser push notifications for all activity.",
        },
      ],
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Notification Preferences"
        desc="Choose what you want to be notified about and how."
      />
      <p className="text-sm text-orange-500 text-center mt-4">
        We are working on it. Comming Soon!
      </p>
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {group.label}
            </p>
            <div className="border border-white/5 rounded-xl overflow-hidden">
              {group.items.map((item, i) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i < group.items.length - 1 ? "border-b border-white/5" : ""
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
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          variant="secondary"
          size="lg"
          className="gap-2"
          onClick={() => toast.success("Notification preferences saved.")}
        >
          <Save size={15} />
          Save preferences
        </Button>
      </div>
    </div>
  );
}
