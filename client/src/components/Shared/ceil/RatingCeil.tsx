"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingCeilProps {
  rating: number;
  max?: number;
  showText?: boolean;
}

const RatingCeil = ({ rating, max = 10, showText = true }: RatingCeilProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md">
        <Star className="h-3.5 w-3.5 fill-amber-500" />
        <span className="text-sm font-bold leading-none">
          {Number(rating).toFixed(1)}
        </span>
      </div>
      {showText && (
        <span className="text-xs text-muted-foreground font-medium">
          / {max}
        </span>
      )}
    </div>
  );
};

export default RatingCeil;
