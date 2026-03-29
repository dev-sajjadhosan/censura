import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/user.service";
import { ArrowUpRightFromCircle } from "lucide-react";
import { headers } from "next/headers";
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
];

export default async function Navbar() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  const user = await getCurrentUser();

  if (pathname?.includes("/profile")) {
    return null;
  }

  return (
    <header className="flex items-center justify-between h-17 rounded-xl w-9/12 mx-auto sticky top-1 z-50 backdrop-blur-sm bg-secondary/50 px-7">
      <div>
        <h1 className="text-xl font-sans">Censura</h1>
      </div>
      <div>
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
