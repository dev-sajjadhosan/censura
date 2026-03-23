"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
  redirectPath?: string;
}

export default function LoginForm({ redirectPath }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {mutateAsync, isPending} = useMutation({})

  return (
    <>
      <div className="border border-secondary/30 w-5xl h-full rounded-2xl p-20">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-light">
            Hey there,{" "}
            <span className="font-bold text-muted-foreground">Welcome</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            We are glad to see you again! Please enter your details to login and
            again join with us on our journey.
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-15">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Login</Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-5">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
