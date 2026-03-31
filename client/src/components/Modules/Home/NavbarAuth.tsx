"use client";

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
      <Link href="/profile">
        <Button size="xl" variant="secondary">
          <ArrowUpRightFromCircle />
          Profile
        </Button>
      </Link>
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