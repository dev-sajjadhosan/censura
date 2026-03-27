import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/user.service";
import { ArrowUpRightFromCircle } from "lucide-react";
import Link from "next/link";

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
    title: "Movies",
    href: "/explore?type=MOVIE",
  },
  {
    title: "TV Shows",
    href: "/explore?type=SERIES",
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    auth: true,
  },
];

export default async function Navbar() {
  const user = await getCurrentUser();
  return (
    <header className="flex items-center justify-between h-18 w-9/12 mx-auto border-b border-neutral-700/45 sticky top-5 z-50">
      <div>
        <h1 className="text-xl font-sans">Censura</h1>
      </div>
      <div>
        <ul className="flex items-center gap-5">
           {navMenus
             .filter(menu => !menu.auth || user)
             .map((menu) => (
             <li key={menu.href}>
               <Link href={menu.href} className="hover:text-primary transition-colors">
                 {menu.title}
               </Link>
             </li>
           ))}
        </ul>
      </div>
      {user ? (
        <div className="flex items-center gap-1">
          <Link href={"/profile"}>
            <Button size={"xl"} variant={"secondary"}>
              <ArrowUpRightFromCircle />
              Profile
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Link href={"/register"}>
            <Button size={"xl"} variant={"ghost"}>
              Register
            </Button>
          </Link>
          <Link href={"/login"}>
            <Button size={"xl"} variant={"secondary"}>
              <ArrowUpRightFromCircle />
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
