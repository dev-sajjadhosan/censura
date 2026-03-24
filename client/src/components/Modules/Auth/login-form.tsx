"use client";

import { loginAction } from "@/app/(auth-pages)/login/_action";
import AppField from "@/components/Shared/Form/AppField";
import AppSubmitButton from "@/components/Shared/Form/AppSubmitButton";
import SocialProviders from "@/components/Shared/social-providers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ILoginProps, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Key, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
  redirectPath?: string;
}

export default function LoginForm({ redirectPath }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginProps) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const res = (await mutateAsync(value)) as any;

        if (!res.success) {
          setServerError(res.message || "Login failed. Please try again.");
          return;
        }
      } catch (error: any) {
        console.log("Login form action error: ", error);
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  return (
    <>
      <div className="w-full md:w-5xl h-full rounded-2xl p-5 md:p-15">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-light">
            Hey there,{" "}
            <span className="font-bold text-muted-foreground">Welcome</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            We are glad to see you again! Please enter your details to login and
            again join with us on our journey.
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-11">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="email"
              validators={{ onChange: loginZodSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  prepend={<Mail className="size-5 text-muted-foreground" />}
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{ onChange: loginZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  prepend={<Key className="size-5 text-muted-foreground" />}
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  // type="text"
                  placeholder="Enter your password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="cursor-pointer"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      variant="ghost"
                      size="icon"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            <div className="text-right mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            {serverError && (
              <Alert variant={"destructive"}>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Logging In...."
                  disabled={!canSubmit}
                >
                  Log In
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </div>
        <div className="flex items-center justify-center gap-2 mt-5">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary">
              Register
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Or continue with</p>
            <div className="flex-1 h-px bg-muted-foreground"></div>
          </div>
          <SocialProviders />
        </div>
      </div>
    </>
  );
}
