import { Button } from "@/components/ui/button";
import { ArrowUpRightFromCircle, LogIn, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between h-20 w-5xl border border-neutral-700/45 bg-secondary/45 backdrop-blur-sm rounded-full px-9 fixed top-7 left-1/2 -translate-x-1/2 z-50">
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
        <Button size={"xl"} variant={"ghost"}>
          Register 
        </Button>
        <Button size={"xl"} variant={'secondary'}>
          {/* <LogIn /> */}
          <ArrowUpRightFromCircle/>
        </Button>
      </div>
    </header>
  );
}
