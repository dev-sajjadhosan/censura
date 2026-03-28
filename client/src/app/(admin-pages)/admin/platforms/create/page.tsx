"use client";

import { PlatformForm } from "@/components/Modules/Admin/Platforms/PlatformForm";
import { ChevronLeft, Globe, Layout, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreatePlatformPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col gap-6">
        <Button variant="ghost" asChild className="-ml-4 w-fit text-muted-foreground hover:text-foreground transition-all duration-300">
          <Link href="/admin/platforms">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Portals
          </Link>
        </Button>
        
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5 transition-transform duration-300 hover:scale-110">
            <MonitorPlay className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">Register Portal</h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase font-semibold opacity-70">
              Integrate external streaming integrations
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity duration-500 scale-150">
          <Globe className="h-48 w-48 -rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <PlatformForm initialData={null} isModal={false} />
        </div>
      </div>
    </div>
  );
}
