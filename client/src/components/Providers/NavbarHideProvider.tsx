"use client";

import { usePathname } from "next/navigation";

export default function NavbarVisibilityWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  if (pathname?.includes("/profile")) return null;
  
  return <>{children}</>;
}