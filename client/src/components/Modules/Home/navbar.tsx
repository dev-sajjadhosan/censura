import { Button } from "@/components/ui/button";
import { ArrowUpRightFromCircle, LogIn, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between h-18 w-9/12 mx-auto border-b border-neutral-700/45 sticky top-5 z-50">
      <div>
        <h1 className="text-xl font-sans">Censura</h1>
      </div>
      <div>
        <ul className="flex items-center gap-5">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
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
    </header>
  );
}
