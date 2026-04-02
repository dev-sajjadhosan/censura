"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function MobileSidebarTrigger() {
  const { toggleSidebar, openMobile } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-6 left-6 z-50 flex md:hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform active:scale-95"
      aria-label="Toggle sidebar"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={openMobile ? "open" : "closed"}
          initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {openMobile
            ? <X className="size-5 text-white/80" />
            : <PanelLeft className="size-5 text-white/80" />
          }
        </motion.span>
      </AnimatePresence>

      {!openMobile && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
        </span>
      )}
    </button>
  );
}