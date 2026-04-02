"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IProfileResponse } from "@/types/auth.types";
import { ArrowUpRightFromCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  user: IProfileResponse | null;
};

export default function NavbarAuth({ user }: Props) {
  return user ? (
    <div className="flex items-center gap-1">
      {user.role === "ADMIN" ? (
        <Link href="/profile">
          <Avatar className="ring-2 p-0.5">
            <AvatarImage
              src={user?.image || "https://github.com/shadcn.png"}
              alt={user?.name}
            />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link href="/profile">
          <Button size="xl" variant="secondary">
            <ArrowUpRightFromCircle />
            Profile
          </Button>
        </Link>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-1">
      <Link href="/register">
        <Button size="xl" variant="ghost">
          Register
        </Button>
      </Link>
      <Link href="/login">
        <Button size="xl" variant="secondary">
          <ArrowUpRightFromCircle />
        </Button>
      </Link>
    </div>
  );
}
