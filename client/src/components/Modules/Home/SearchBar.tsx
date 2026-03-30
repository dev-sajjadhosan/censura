"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Film, Tv } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/explore?search=${encodeURIComponent(query)}`);
  };

  const handleQuickFilter = (type: string) => {
    router.push(`/explore?type=${type}`);
  };

  return (
    <div className="w-11/12 mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <form
          onSubmit={handleSearch}
          className={cn("flex items-center gap-1 w-xl bg-secondary/45 px-5 rounded-xl", className)}
        >
          <Search className="size-5" />
          <Input
            type="text"
            placeholder="Search movies, series, or reviews..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-0"
          />
        </form>
{/* 
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size={"lg"}
            onClick={() => handleQuickFilter("MOVIE")}
          >
            <Film className="w-4 h-4 mr-2" /> Movies
          </Button>
          <Button
            variant="ghost"
            size={"lg"}
            onClick={() => handleQuickFilter("SERIES")}
          >
            <Tv className="w-4 h-4 mr-2" /> Series
          </Button>
        </div> */}
      </div>
    </div>
  );
}
