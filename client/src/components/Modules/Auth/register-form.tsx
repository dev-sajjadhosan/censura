"use client";

import { registerAction } from "@/app/(auth-pages)/register/_action";
import AppField from "@/components/Shared/Form/AppField";
import AppSubmitButton from "@/components/Shared/Form/AppSubmitButton";
import SocialProviders from "@/components/Shared/social-providers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IRegisterProps, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AtSign, Eye, EyeOff, Key, User2, UserPlus2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    if (rememberMe) {
      toast.success("Remember me", {
        description: "You will be remembered for 30 days",
        duration: 2000,
      });
    }
  }, [rememberMe]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterProps) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // console.log("Register Payload:", value);
        const res = (await mutateAsync(value)) as any;
        console.log("Register Response:", res);

        // if (!res.success) {
        //   setServerError(res.message || "Registration failed");
        //   return;
        // }
      } catch (error: any) {
        console.log("Register Error:", error);
        setServerError(error.message);
      }
    },
  });

  return (
    <div className="w-full md:w-5xl h-full rounded-2xl p-5 md:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-light">
          Welcome,{" "}
          <span className="font-bold text-muted-foreground">Movie Lover!</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          We are glad to have you here! Please enter your details to register
          and join with us to explore the world of{" "}
          <span className="font-bold text-orange-500">Censura</span>.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-11">
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                prepend={<User2 className="size-5 text-muted-foreground" />}
                field={field}
                label="Name"
                type="text"
                placeholder="Enter your name"
              />
            )}
          </form.Field>
          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                prepend={<AtSign className="size-5 text-muted-foreground" />}
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: registerZodSchema.shape.password }}
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

          <div className="flex items-center justify-between mb-11">
            {/* Accept Terms */}
            <form.Field name="acceptTerms">
              {(field) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms-and-conditions"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <Label
                    htmlFor="terms-and-conditions"
                    className="text-sm text-muted-foreground"
                  >
                    Accept Terms and Conditions
                  </Label>
                  {/* show error if not checked on submit */}
                  {field.state.meta.errors?.[0] && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Remember Me */}
            <form.Field name="rememberMe">
              {(field) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={field.state.value}
                    onCheckedChange={(checked) => {
                      field.handleChange(!!checked);
                      setRememberMe(!!checked);
                    }}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
              )}
            </form.Field>
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
                pendingLabel="Registering...."
                disabled={!canSubmit || !form.state.values.acceptTerms}
              >
                Register
                <UserPlus2 />
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-orange-500"></div>
          <p className="text-sm text-muted-foreground">Or continue with</p>
        </div>
        {/* Social Providers */}
        <SocialProviders />
      </div>
    </div>
  );
}
