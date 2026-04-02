"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function MobileNavbar({
  navMenus,
}: {
  navMenus: { title: string; href: string; icon?: React.ReactNode }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-12 z-40 w-56 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="p-1.5">
              {navMenus.map((menu, i) => (
                <motion.div
                  key={menu.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={menu.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                  >
                    {menu.icon && (
                      <span className="text-white/40 transition-colors group-hover:text-white/80">
                        {menu.icon}
                      </span>
                    )}
                    <span>{menu.title}</span>

                    {/* subtle arrow on hover */}
                    <span className="ml-auto translate-x-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-60">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom accent line */}
            <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
            <div className="px-4 py-2.5 text-[11px] text-white/20">
              Navigation
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}