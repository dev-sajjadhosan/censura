"use client";

import { cn } from "@/lib/utils";

interface DateCeilProps {
  date: string | number | Date;
  formatString?: string; // Kept for compatibility with your existing callers
  className?: string;
}

const DateCeil = ({ date, className }: DateCeilProps) => {
  if (!date) return <span className="text-muted-foreground">—</span>;

  const d = new Date(date);
  if (isNaN(d.getTime())) return <span className="text-muted-foreground">—</span>;

  // Emulating "MMM dd, yyyy" using Intl.DateTimeFormat
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);

  return (
    <div className={cn("flex flex-col min-w-[100px]", className)}>
      <span className="text-sm font-medium tracking-tight">{formatted}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
        {d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </span>
    </div>
  );
};

export default DateCeil;
