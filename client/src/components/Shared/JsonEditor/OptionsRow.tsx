import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OptionRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id: string;
}

export default function OptionRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: OptionRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 px-1 rounded-lg hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="shrink-0 text-muted-foreground group-hover:text-neutral-400 transition-colors">
          {icon}
        </span>
        <div className="min-w-0">
          <Label
            htmlFor={id}
            className="text-[12px] font-medium cursor-pointer leading-none"
          >
            {label}
          </Label>
          {description && (
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0 scale-75 data-[state=checked]:bg-violet-600"
      />
    </div>
  );
}
