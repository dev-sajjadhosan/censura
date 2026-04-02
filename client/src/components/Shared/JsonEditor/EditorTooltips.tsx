import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Copy, Trash2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import InfoPopover from "./InfoPopover";
import { EditorOptions as EditorOptionsType } from "./JsonImportModal";
import EditorOptions from "./EditorOptions";
import { TooltipButton } from "../tooltip-button";

export default function EditorTooltips({
  value,
  setValue,
  setError,
  fontSize,
  setFontSize,
  editorOptions,
  setEditorOptions,
  DEFAULT_OPTIONS,
  toast,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  setError: (error: string | null) => void;
  fontSize: number;
  setFontSize: Dispatch<SetStateAction<number>>;
  editorOptions: EditorOptionsType;
  setEditorOptions: Dispatch<SetStateAction<EditorOptionsType>>;
  DEFAULT_OPTIONS: EditorOptionsType;
  toast: any;
}) {
  const setOption = <K extends keyof EditorOptionsType>(
    key: K,
    val: EditorOptionsType[K],
  ) => setEditorOptions((prev) => ({ ...prev, [key]: val }));

  const handleResetOptions = () => {
    setEditorOptions(DEFAULT_OPTIONS);
    toast.success("Editor options reset to defaults");
  };
  const handleBeautify = () => {
    try {
      if (!value.trim()) return;
      const formatted = JSON.stringify(JSON.parse(value), null, 2);
      setValue(formatted);
      setError(null);
      toast.success("JSON Beautified ✨");
    } catch (e: any) {
      toast.error("Invalid JSON — can't beautify");
      setError(e.message);
    }
  };

  const handleCopy = () => {
    if (!value.trim()) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const handleClear = () => {
    setValue("");
    setError(null);
  };
  const handleZoomIn = () => setFontSize((f) => Math.min(f + 2, 24));
  const handleZoomOut = () => setFontSize((f) => Math.max(f - 2, 10));
  const handleResetZoom = () => setFontSize(14);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 shrink-0">
        <TooltipButton
          tooltip="Beautify"
          children={
            <Button variant="ghost" size="sm" onClick={handleBeautify}>
              <Wand2 />
            </Button>
          }
        />
        <TooltipButton
          tooltip="Copy"
          children={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!value.trim()}
            >
              <Copy />
            </Button>
          }
        />
        <TooltipButton
          tooltip="Clear"
          children={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!value.trim()}
            >
              <Trash2 />
            </Button>
          }
        />

        <div className="flex-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 rounded-lg p-1 bg-secondary">
          <TooltipButton
            tooltip="Zoom Out"
            children={
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut />
              </Button>
            }
          />
          <button
            onClick={handleResetZoom}
            className="px-2 text-[10px] font-mono text-neutral-400 hover:text-neutral-200 transition-colors min-w-[32px] text-center"
          >
            {fontSize}px
          </button>
          <TooltipButton
            tooltip="Zoom In"
            children={
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn />
              </Button>
            }
          />
        </div>
        <TooltipButton
          tooltip="Reset zoom"
          children={
            <Button variant="ghost" size="sm" onClick={handleResetZoom}>
              <RotateCcw />
            </Button>
          }
        />

        {/* ── Editor Options Popover ── */}
        <EditorOptions
          editorOptions={editorOptions}
          setOption={setOption}
          handleResetOptions={handleResetOptions}
        />

        {/* ── Info / Shortcuts Popover ── */}
        <InfoPopover />
      </div>
    </div>
  );
}
