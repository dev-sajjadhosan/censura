"use client"


import { Button } from "@/components/ui/button";
import { Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notShowNavbar = ["/logout", "/verify-email"];
  const pathname = usePathname();

  const isLogoutPage = notShowNavbar.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen w-full items-center">
      {!isLogoutPage && <div className="flex items-center justify-between w-7/12 mt-3">
        <Link href={"/"}>
          <Button variant="ghost" size={"xl"}>
            <Home />
          </Button>
        </Link>
        <h1 className="text-xl font-sans">Censura</h1>
        <Button variant="ghost" size={"xl"}>
          <Settings />
        </Button>
      </div>}
        <div className="w-full h-full px-5">
        <div className="flex items-center justify-center w-full h-full rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
