import { getCurrentUser } from "@/services/user.service";
import Link from "next/link";
import NavbarAuth from "./NavbarAuth";
import NavbarVisibilityWrapper from "@/components/Providers/NavbarHideProvider";
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
  const user = await getCurrentUser();

  return (
    <NavbarVisibilityWrapper>
      <header className="flex items-center justify-between h-17 rounded-xl w-7/12 mx-auto sticky top-1 z-50 backdrop-blur-sm bg-secondary/50 px-7">
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
        <NavbarAuth user={user} />
      </header>
    </NavbarVisibilityWrapper>
  );
}
