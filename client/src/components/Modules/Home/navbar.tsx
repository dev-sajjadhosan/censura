import { getCurrentUser } from "@/services/user.service";
import Link from "next/link";
import NavbarAuth from "./NavbarAuth";
import VisibilityWrapper from "@/components/Providers/VisibilityWrapper";
import { LayoutDashboard, Menu } from "lucide-react";
import MobileNavbar from "./MobileNavbar";
import { Button } from "@/components/ui/button";
const navMenus = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Explore",
    href: "/explore",
  },
  {
    title: "Subscription",
    href: "/subscription",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Contact Us",
    href: "/contact-us",
  },
];
export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <VisibilityWrapper>
      <header className="flex items-center justify-between h-17 rounded-xl w-11/12 md:w-7/12 mx-auto sticky top-1 z-50 backdrop-blur-sm bg-secondary/50 px-7">
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <MobileNavbar navMenus={navMenus} />
          </div>
          <h1 className="text-xl font-sans">Censura</h1>
        </div>
        <div className="hidden md:block">
          <ul className="flex items-center gap-5">
            {navMenus.map((menu) => (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  className="hover:text-primary transition-colors text-sm"
                >
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
        <NavbarAuth user={user} />
        {user?.role === "ADMIN" && (
          <Link href="/admin/dashboard">
            <Button variant={"default"}>
               <LayoutDashboard />
            </Button>
          </Link>
        )}
        </div>
      </header>
    </VisibilityWrapper>
  );
}
