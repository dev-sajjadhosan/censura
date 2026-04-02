"use client";

import { usePathname } from "next/navigation";

const NotToShowNavbar = ["/payment/success", "/payment/cancel", "/subscription", "/profile", "/profile/collections", "/profile/settings"]

export default function VisibilityWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  if (NotToShowNavbar.includes(pathname)) return null;
  
  return <>{children}</>;
}