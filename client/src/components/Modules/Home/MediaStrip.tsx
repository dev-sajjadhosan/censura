import MediaCard from "@/components/Modules/Media/MediaCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MediaStripProps {
  title: string;
  mediaList: any[];
  exploreLink?: string;
  className?: string;
}

export default function MediaStrip({ title, mediaList, exploreLink, className = "" }: MediaStripProps) {
  if (!mediaList || mediaList.length === 0) return null;

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight border-l-4 border-primary pl-4">{title}</h2>
          {exploreLink && (
            <Link href={exploreLink}>
              <Button variant="ghost" className="text-muted-foreground hover:text-white group">
                View All <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scroll-indicator">
            {mediaList.map((media) => (
              <div key={media.id} className="min-w-[280px] md:min-w-[320px] snap-start shrink-0">
                <MediaCard media={media} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
