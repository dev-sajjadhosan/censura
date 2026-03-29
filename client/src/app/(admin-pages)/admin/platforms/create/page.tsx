"use client";

import { PlatformForm } from "@/components/Modules/Admin/Platforms/PlatformForm";
import { ChevronLeft, Globe, Layout, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreatePlatformPage() {
  return (
    <div className="w-full p-5 space-y-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div>
            <MonitorPlay className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl tracking-tight">Register Portal</h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase font-semibold opacity-70">
              Integrate external streaming integrations
            </p>
          </div>
        </div>
      </div>

      <div className="mt-25">
        <PlatformForm initialData={null} isModal={false} />
      </div>
    </div>
  );
}
