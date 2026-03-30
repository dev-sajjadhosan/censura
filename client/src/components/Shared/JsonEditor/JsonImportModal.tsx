"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Code2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

import EditorOptions from "./EditorOptions";
import EditorTooltips from "./EditorTooltips";

interface JsonImportModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any) => Promise<void>;
  isLoading?: boolean;
}

// ── Editor option types ──────────────────────────────────────────────────────
export interface EditorOptions {
  minimap: boolean;
  lineNumbers: boolean;
  wordWrap: boolean;
  formatOnPaste: boolean;
  formatOnType: boolean;
  bracketPairColorization: boolean;
  bracketGuides: boolean;
  renderLineHighlight: boolean;
  smoothScrolling: boolean;
  cursorSmoothCaretAnimation: boolean;
  suggest: boolean;
  tabSize: number;
  scrollbarSize: number;
}

export const DEFAULT_OPTIONS: EditorOptions = {
  minimap: false,
  lineNumbers: true,
  wordWrap: true,
  formatOnPaste: true,
  formatOnType: true,
  bracketPairColorization: true,
  bracketGuides: true,
  renderLineHighlight: true,
  smoothScrolling: true,
  cursorSmoothCaretAnimation: true,
  suggest: true,
  tabSize: 2,
  scrollbarSize: 4,
};

export const JsonImportModal = ({
  title,
  description,
  isOpen,
  onOpenChange,
  onImport,
  isLoading = false,
}: JsonImportModalProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [editorOptions, setEditorOptions] =
    useState<EditorOptions>(DEFAULT_OPTIONS);

  const validateJson = useCallback((val: string) => {
    if (!val.trim()) {
      setError(null);
      return;
    }
    try {
      JSON.parse(val);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const handleEditorChange = (val: string | undefined) => {
    const newValue = val || "";
    setValue(newValue);
    validateJson(newValue);
  };

  const onSubmit = async () => {
    try {
      if (!value.trim()) {
        toast.error("Please provide some JSON data");
        return;
      }
      const parsed = JSON.parse(value);
      await onImport(parsed);
      setValue("");
      onOpenChange(false);
    } catch (e: any) {
      toast.error("Invalid JSON: " + e.message);
      setError(e.message);
    }
  };

  const lineCount = value ? value.split("\n").length : 0;
  const charCount = value.length;

  const monacoOptions = {
    minimap: { enabled: editorOptions.minimap },
    fontSize,
    lineNumbers: editorOptions.lineNumbers ? ("on" as const) : ("off" as const),
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: editorOptions.tabSize,
    padding: { top: 16, bottom: 16 },
    formatOnPaste: editorOptions.formatOnPaste,
    formatOnType: editorOptions.formatOnType,
    wordWrap: editorOptions.wordWrap ? ("on" as const) : ("off" as const),
    renderLineHighlight: editorOptions.renderLineHighlight
      ? ("gutter" as const)
      : ("none" as const),
    cursorBlinking: "smooth" as const,
    cursorSmoothCaretAnimation: editorOptions.cursorSmoothCaretAnimation
      ? ("on" as const)
      : ("off" as const),
    smoothScrolling: editorOptions.smoothScrolling,
    bracketPairColorization: { enabled: editorOptions.bracketPairColorization },
    guides: { bracketPairs: editorOptions.bracketGuides },
    suggest: { showKeywords: editorOptions.suggest },
    lineDecorationsWidth: 8,
    overviewRulerBorder: false,
    scrollbar: {
      verticalScrollbarSize: editorOptions.scrollbarSize,
      horizontalScrollbarSize: editorOptions.scrollbarSize,
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl h-[88vh] flex flex-col p-0 bg-secondary overflow-hidden rounded-2xl">
        <DialogHeader className="px-5 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <Code2 className="size-6 text-violet-400" />
              <div>
                <DialogTitle className="text-md tracking-tight text-muted-foreground">
                  {title}
                </DialogTitle>
              </div>
            </div>
            <EditorTooltips
              value={value}
              setValue={setValue}
              setError={setError}
              fontSize={fontSize}
              setFontSize={setFontSize}
              editorOptions={editorOptions}
              setEditorOptions={setEditorOptions}
              DEFAULT_OPTIONS={DEFAULT_OPTIONS}
              toast={toast}
            />
          </div>
        </DialogHeader>

        {/* ── Editor ── */}
        <div className="flex-1 relative min-h-0">
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={value}
            onChange={handleEditorChange}
            options={monacoOptions}
            loading={
              <div className="flex items-center justify-center h-full gap-2 text-neutral-600">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Loading editor…</span>
              </div>
            }
          />
          {!value && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-1.5 opacity-50">
                <Code2 className="size-8 mx-auto text-orange-500" />
                <p className="text-sm text-neutral-400 font-medium">
                  Paste your JSON here
                </p>
                <p className="text-xs ">or start typing…</p>
                <p className="text-sm  mt-3">{description}</p>
              </div>
            </div>
          )}
        </div>
        <div className=" px-5 pb-3 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-[10px]">
            {error ? (
              <div className="flex items-center gap-1.5 text-red-500 font-medium animate-in fade-in slide-in-from-left-2">
                <AlertCircle className="size-3.5 shrink-0" />
                <span className="truncate max-w-[320px]">{error}</span>
              </div>
            ) : value.trim() ? (
              <div className="flex items-center gap-1.5 text-emerald-500 font-medium animate-in fade-in">
                <CheckCircle2 className="size-3.5" />
                <span>Valid JSON</span>
              </div>
            ) : (
              <span className="text-muted-foreground">No content yet</span>
            )}
            {value.trim() && (
              <>
                <span className="text-white/10">|</span>
                <span className="text-muted-foreground font-mono">
                  {lineCount} lines · {charCount} chars
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isLoading || !!error || !value.trim()}
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
              {isLoading ? "Importing…" : "Finalize Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
