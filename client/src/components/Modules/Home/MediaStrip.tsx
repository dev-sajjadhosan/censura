"use client";

import MediaCard from "@/components/Modules/Media/MediaCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IProfileResponse } from "@/types/auth.types";
import MediaCardSkeleton from "../Media/MediaCardskeleten";

interface MediaStripProps {
  title: string;
  mediaList: any[];
  exploreLink?: string;
  className?: string;
  user: IProfileResponse;
  isLoading: boolean;
}

export default function MediaStrip({
  title,
  mediaList,
  exploreLink,
  className = "",
  user,
  isLoading,
}: MediaStripProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight border-l-4 border-primary pl-4">
            {title}
          </h2>
          {exploreLink && (
            <Link href={exploreLink}>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-white group"
              >
                View All{" "}
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative w-full">
          <div className="flex overflow-x-auto gap-5 pb-6 hide-scroll-indicator w-full">
            {isLoading || !mediaList || mediaList.length === 0 ? (
              <div className="flex gap-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[280px] md:min-w-[320px] snap-start shrink-0 flex items-stretch h-auto"
                  >
                    <MediaCardSkeleton />
                  </div>
                ))}
              </div>
            ) : (
              mediaList.map((media) => (
                <div key={media.id} className="w-sm">
                  <MediaCard media={media} user={user} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
