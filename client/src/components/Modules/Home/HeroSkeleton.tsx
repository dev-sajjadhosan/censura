// components/Home/HeroSkeleton.tsx
export default function HeroSkeleton() {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden mb-12">
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-20">
        <div className="max-w-2xl space-y-6">

          {/* Badges */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-neutral-700 rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-neutral-700 rounded-full animate-pulse" />
            <div className="h-6 w-12 bg-neutral-700 rounded-full animate-pulse" />
          </div>

          {/* Title — two lines like big hero text */}
          <div className="space-y-3">
            <div className="h-16 w-3/4 bg-neutral-700 rounded-lg animate-pulse" />
            <div className="h-16 w-1/2 bg-neutral-700 rounded-lg animate-pulse" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <div className="h-14 w-44 bg-neutral-700 rounded-full animate-pulse" />
            <div className="h-14 w-44 bg-neutral-800 rounded-full animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
}