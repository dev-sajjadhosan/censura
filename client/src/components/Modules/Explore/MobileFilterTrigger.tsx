// components/Modules/Explore/MobileFilterTrigger.tsx
"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";

export default function MobileFilterTrigger() {
  const { toggleSidebar, open } = useSidebar();
  const searchParams = useSearchParams();

  const activeFilterCount = [
    searchParams.get("type"),
    searchParams.get("genre"),
    searchParams.get("platform"),
    searchParams.get("minRating"),
  ].filter(Boolean).length;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <motion.button
        onClick={toggleSidebar}
        whileTap={{ scale: 0.93 }}
        className="relative flex items-center gap-2.5 rounded-full border border-white/10 bg-neutral-900/90 px-5 py-3 text-sm font-medium text-white shadow-2xl shadow-black/50 backdrop-blur-xl transition-colors hover:bg-neutral-800/90"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "filter"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            {open ? (
              <X className="size-4" />
            ) : (
              <SlidersHorizontal className="size-4" />
            )}
          </motion.span>
        </AnimatePresence>

        <span>{open ? "Close" : "Filters"}</span>

        {/* Active filter count badge */}
        <AnimatePresence>
          {activeFilterCount > 0 && !open && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
            >
              {activeFilterCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}