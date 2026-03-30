import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";

import {
  Loader2,
  Code2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Keyboard,
  Wand2,
  Copy,
  Trash2,
  WrapText,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

const KEYBOARD_SHORTCUTS = [
  { keys: ["Ctrl", "Shift", "F"], label: "Format / Beautify JSON" },
  { keys: ["Ctrl", "Z"], label: "Undo last change" },
  { keys: ["Ctrl", "Y"], label: "Redo change" },
  { keys: ["Ctrl", "A"], label: "Select all content" },
  { keys: ["Ctrl", "/"], label: "Toggle line comment" },
  { keys: ["Alt", "↑↓"], label: "Move line up / down" },
  { keys: ["Ctrl", "D"], label: "Duplicate selection" },
  { keys: ["Ctrl", "F"], label: "Find in editor" },
];

const EDITOR_FEATURES = [
  {
    icon: <Wand2 className="size-3.5 text-violet-400" />,
    label: "Auto Beautify",
    desc: "Paste messy JSON and hit Beautify to format it instantly.",
  },
  {
    icon: <CheckCircle2 className="size-3.5 text-emerald-400" />,
    label: "Live Validation",
    desc: "Errors are highlighted in real-time as you type.",
  },
  {
    icon: <WrapText className="size-3.5 text-sky-400" />,
    label: "Word Wrap",
    desc: "Long lines wrap automatically so nothing goes off-screen.",
  },
  {
    icon: <ZoomIn className="size-3.5 text-amber-400" />,
    label: "Zoom Controls",
    desc: "Use the toolbar to increase or decrease editor font size.",
  },
];

function KbdKey({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300 shadow-inner">
      {children}
    </kbd>
  );
}

export default function InfoPopover() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-lg">
            <Info />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="w-fit rounded-xl overflow-hidden"
        >
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="size-3.5 text-violet-400" />
            Editor Features
          </p>
          <div className="px-3">
            {EDITOR_FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-2 rounded-lg p-2 hover:bg-white/5 transition-colors"
              >
                <span className="mt-0.5 shrink-0">{f.icon}</span>
                <div>
                  <p className="text-[12px] font-medium text-neutral-200">
                    {f.label}
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-white/8" />

          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Keyboard className="size-3" />
              Keyboard Shortcuts
            </p>
            <div className="space-y-2 grid grid-cols-2 gap-3">
              {KEYBOARD_SHORTCUTS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-3 "
                >
                  <span className="text-[11px] text-neutral-400 truncate">
                    {s.label}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {s.keys.map((k, i) => (
                      <React.Fragment key={k}>
                        <KbdKey>{k}</KbdKey>
                        {i < s.keys.length - 1 && (
                          <span className="text-neutral-600 text-[10px]">
                            +
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-3">
            <p className="text-[11px] text-amber-400/80 leading-relaxed">
              💡 <span className="font-medium">Tip:</span> Paste any raw JSON
              and click{" "}
              <span className="font-semibold text-amber-300">Beautify</span> to
              auto-format it before importing.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
