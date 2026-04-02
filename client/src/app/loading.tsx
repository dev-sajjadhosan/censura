import { Clapperboard } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* 1. Icon Section (Uses custom fade-in + built-in bounce) */}
      <div className="relative animate-fade-in-up">
        <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-3xl animate-pulse" />
        <div className="relative p-6 rounded-3xl">
          <Clapperboard className="size-14 text-orange-500 animate-bounce" />
        </div>
      </div>

      {/* 2. Brand Section */}
      <div className="mt-10 flex flex-col items-center gap-4 animate-fade-in-up [animation-delay:200ms]">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter italic uppercase">
            Cine<span className="text-orange-500">Stream</span>
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-medium mt-1">
            Quality over everything
          </p>
        </div>

        {/* 3. Custom Shimmer Progress Bar */}
        <div className="relative w-56 h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/10" />
          <div className="h-1 bg-orange-500 w-1/3 animate-shimmer rounded-full mt-1" />
        </div>

        <span className="text-[9px] text-orange-500/70 font-bold tracking-[0.2em] animate-pulse">
          PREPARING CINEMA ENGINE
        </span>
      </div>
    </div>
  );
}
