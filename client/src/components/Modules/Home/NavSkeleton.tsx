export default function NavbarSkeleton() {
  return (
    <div className="w-full h-17 flex items-center justify-center sticky top-1 z-50 px-4">
      {/* Same container styling as your real Navbar */}
      <div className="flex items-center justify-between h-17 rounded-xl w-7/12 mx-auto bg-secondary/30 backdrop-blur-sm px-7 border border-white/5 animate-pulse">
        
        {/* Logo Skeleton */}
        <div className="h-6 w-24 bg-muted rounded-md" />

        {/* Menu Items Skeleton */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="h-4 w-16 bg-muted/60 rounded-md" />
            ))}
          </ul>
        </div>

        {/* Auth Section Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-muted rounded-lg" />
          {/* Circular Avatar Skeleton */}
          <div className="h-9 w-9 bg-muted rounded-full" />
        </div>

      </div>
    </div>
  );
}