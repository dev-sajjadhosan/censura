import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Settings2,
  RotateCcw,
  AlignLeft,
  Map,
  WrapText,
  Ruler,
  Wand2,
  Braces,
  Eye,
  MousePointer2,
  Lightbulb,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import OptionRow from "./OptionsRow";
import { EditorOptions as EditorOptionsType } from "./JsonImportModal";
import { TooltipButton } from "../tooltip-button";

export default function EditorOptions({
  editorOptions,
  setOption,
  handleResetOptions,
}: {
  editorOptions: EditorOptionsType;
  setOption: <K extends keyof EditorOptionsType>(
    key: K,
    val: EditorOptionsType[K],
  ) => void;
  handleResetOptions: () => void;
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-lg">
            <Settings2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-3xl rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Settings2 className="size-3.5" />
                Editor Controls
              </p>
            </div>
            <Button onClick={handleResetOptions} variant={"ghost"} size={"sm"}>
              <RotateCcw />
              Reset
            </Button>
          </div>

          <div className="px-3 space-y-0.5 max-h-120 overflow-y-scroll scrollbar-thin">
            {/* Display */}
            <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest px-1 pb-1 pt-1">
              Display
            </p>
            <div className="grid grid-cols-2 gap-5">
              <OptionRow
                id="opt-linenumbers"
                icon={<AlignLeft className="size-3.5" />}
                label="Line Numbers"
                description="Show line numbers in the gutter"
                checked={editorOptions.lineNumbers}
                onCheckedChange={(v) => setOption("lineNumbers", v)}
              />
              <OptionRow
                id="opt-minimap"
                icon={<Map className="size-3.5" />}
                label="Minimap"
                description="Show code overview on the right"
                checked={editorOptions.minimap}
                onCheckedChange={(v) => setOption("minimap", v)}
              />
              <OptionRow
                id="opt-wordwrap"
                icon={<WrapText className="size-3.5" />}
                label="Word Wrap"
                description="Wrap long lines instead of scrolling"
                checked={editorOptions.wordWrap}
                onCheckedChange={(v) => setOption("wordWrap", v)}
              />
              <OptionRow
                id="opt-linehighlight"
                icon={<Ruler className="size-3.5" />}
                label="Line Highlight"
                description="Highlight the active line in gutter"
                checked={editorOptions.renderLineHighlight}
                onCheckedChange={(v) => setOption("renderLineHighlight", v)}
              />
            </div>
            <Separator className="bg-white/6 my-2" />

            {/* Formatting */}
            <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest px-1 pb-1">
              Formatting
            </p>
            <div className="grid grid-cols-2 gap-5">
              <OptionRow
                id="opt-formatpaste"
                icon={<Wand2 className="size-3.5" />}
                label="Format on Paste"
                description="Auto-format when pasting content"
                checked={editorOptions.formatOnPaste}
                onCheckedChange={(v) => setOption("formatOnPaste", v)}
              />
              <OptionRow
                id="opt-formattype"
                icon={<Wand2 className="size-3.5" />}
                label="Format on Type"
                description="Auto-format as you type"
                checked={editorOptions.formatOnType}
                onCheckedChange={(v) => setOption("formatOnType", v)}
              />
              <OptionRow
                id="opt-bracketcolor"
                icon={<Braces className="size-3.5" />}
                label="Bracket Colorization"
                description="Color matching bracket pairs"
                checked={editorOptions.bracketPairColorization}
                onCheckedChange={(v) => setOption("bracketPairColorization", v)}
              />
              <OptionRow
                id="opt-bracketguides"
                icon={<Braces className="size-3.5" />}
                label="Bracket Guides"
                description="Show indent lines for bracket pairs"
                checked={editorOptions.bracketGuides}
                onCheckedChange={(v) => setOption("bracketGuides", v)}
              />
            </div>

            <Separator className="bg-white/6 my-2" />

            {/* Behaviour */}
            <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest px-1 pb-1">
              Behaviour
            </p>
            <div className="grid grid-cols-2 gap-5">
              <OptionRow
                id="opt-smooth"
                icon={<Eye className="size-3.5" />}
                label="Smooth Scrolling"
                description="Animate scroll instead of jumping"
                checked={editorOptions.smoothScrolling}
                onCheckedChange={(v) => setOption("smoothScrolling", v)}
              />
              <OptionRow
                id="opt-cursorcaret"
                icon={<MousePointer2 className="size-3.5" />}
                label="Smooth Cursor"
                description="Animate cursor movement smoothly"
                checked={editorOptions.cursorSmoothCaretAnimation}
                onCheckedChange={(v) =>
                  setOption("cursorSmoothCaretAnimation", v)
                }
              />
              <OptionRow
                id="opt-suggest"
                icon={<Lightbulb className="size-3.5" />}
                label="Suggestions"
                description="Show keyword autocomplete hints"
                checked={editorOptions.suggest}
                onCheckedChange={(v) => setOption("suggest", v)}
              />
            </div>

            <Separator className="bg-white/6 my-2" />

            {/* Tab size slider */}
            <div className="px-1 py-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-[12px] font-medium text-neutral-300">
                  Tab Size
                </Label>
                <span className="text-[11px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                  {editorOptions.tabSize} spaces
                </span>
              </div>
              <Slider
                min={2}
                max={8}
                step={2}
                value={[editorOptions.tabSize]}
                onValueChange={([v]) => setOption("tabSize", v)}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 px-0.5">
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
              </div>
            </div>

            {/* Scrollbar size slider */}
            <div className="px-1 py-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-[12px] font-medium text-neutral-300">
                  Scrollbar Width
                </Label>
                <span className="text-[11px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                  {editorOptions.scrollbarSize}px
                </span>
              </div>
              <Slider
                min={2}
                max={12}
                step={2}
                value={[editorOptions.scrollbarSize]}
                onValueChange={([v]) => setOption("scrollbarSize", v)}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 px-0.5">
                <span>Thin</span>
                <span></span>
                <span></span>
                <span>Wide</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
