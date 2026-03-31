"use client";

import { usePathname } from "next/navigation";

const NotToShowNavbar = ["/payment/success", "/payment/cancel", "/subscription", "/profile"]

export default function NavbarVisibilityWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  if (NotToShowNavbar.includes(pathname)) return null;
  
  return <>{children}</>;
}