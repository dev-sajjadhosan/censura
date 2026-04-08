"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("search") || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep search input in sync with URL
  useEffect(() => {
    setQuery(searchParams?.get("search") || "");
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSuggestions([]);
    
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("search", trimmed);
    params.set("page", "1");
    
    router.push(`/explore?${params.toString()}`);
  };

  const handleInputChange = (val: string) => {
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length > 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/search-suggest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: val }),
          });
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.suggestions || []);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-11/12 mx-auto relative">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center relative">
        <form
          onSubmit={handleSearch}
          className={cn(
            "flex items-center w-full max-w-xl bg-secondary px-3 py-3 rounded-xl",
            className,
          )}
        >
          <Button
            variant={"ghost"}
            type="submit"
            aria-label="Submit search"
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-primary" />
            ) : (
              <Search />
            )}
          </Button>
          <Input
            type="text"
            placeholder="Search with AI magic..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="bg-transparent border-0 text-sm h-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
          />
        </form>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && query && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-xl mt-3 bg-card border border-muted-foreground/20 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-3 border-b border-muted flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Sparkles className="size-3 text-primary" />
              AI Suggestions
            </div>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSuggestions([]);
                  const trimmed = s.trim();
                  setQuery(trimmed);
                  
                  const params = new URLSearchParams(searchParams?.toString() || "");
                  params.set("search", trimmed);
                  params.set("page", "1");
                  router.push(`/explore?${params.toString()}`);
                }}
                className="w-full text-left px-5 py-4 hover:bg-secondary flex items-center justify-between transition-colors border-b last:border-0 border-muted group/item"
              >
                <span className="font-medium">{s}</span>
                <ArrowRight className="size-4 opacity-0 group-hover/item:opacity-100 transition-opacity translate-x-3 group-hover/item:translate-x-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
