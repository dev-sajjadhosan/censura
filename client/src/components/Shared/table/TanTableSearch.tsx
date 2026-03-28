"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DataTableSearchProps {
  initialValue?: string;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
  onDebouncedChange: (value: string) => void;
}

const DataTableSearch = ({
  initialValue = "",
  placeholder = "Search...",
  debounceMs = 700,
  isLoading,
  onDebouncedChange,
}: DataTableSearchProps) => {
  const [value, setValue] = useState(initialValue);
  const skipNextDebounceRef = useRef(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip if it's the first render and value matches initialValue
    if (isFirstRender.current && value.trim() === initialValue.trim()) {
      isFirstRender.current = false;
      return;
    }

    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onDebouncedChange(value.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange, initialValue]);

  const handleClear = () => {
    skipNextDebounceRef.current = true;
    setValue("");
    onDebouncedChange("");
  };

  return (
    <div className="relative w-full md:max-w-sm">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-12 pr-10 pl-10"
        disabled={isLoading}
      />

      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search"
          disabled={isLoading}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default DataTableSearch;
