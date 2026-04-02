"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IForgotPasswordProps,
  forgotPasswordZodSchema,
} from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader, MailCheck, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// 👇 Replace this with your actual server action
import { forgotPasswordAction } from "@/app/(auth-pages)/forgot-password/_action";

export default function ForgotPasswordContent() {
  const router = useRouter();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async (payload: IForgotPasswordProps) => {
      const res = await forgotPasswordAction(payload);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Reset link sent! Check your inbox.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong.");
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync(value);
      } catch (error: any) {
        console.log("forgot password error", error.message);
      }
    },
  });

  // Success state — mirrors your verify-email "email sent" feel
  if (isSuccess) {
    return (
      <div className="h-full flex items-center">
        <div className="flex flex-col items-start justify-center gap-1 w-2xl">
          <Badge variant="outline" className="px-4 py-4">
            CHECK YOUR INBOX
          </Badge>
          <h1 className="text-3xl mt-1">Reset Link Sent</h1>
          <p className="text-sm text-muted-foreground w-full mt-2">
            We&apos;ve sent a password reset link to your email address. The
            link will expire in 15 minutes.
          </p>

          <div className="flex items-center gap-4 mt-9 p-5 border border-border rounded-lg bg-muted/30">
            <MailCheck className="text-orange-500 shrink-0" size={28} />
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => router.refresh()}
                className="text-orange-500 underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                try again
              </button>
              .
            </p>
          </div>

          <Button
            variant="secondary"
            size="xl"
            className="w-fit justify-start gap-3 mt-9"
            onClick={() => router.push("/login")}
          >
            Back to Login <ArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center">
      <div className="flex flex-col items-start justify-center gap-1 w-2xl">
        <Badge variant="outline" className="px-4 py-4">
          FORGOT PASSWORD
        </Badge>
        <h1 className="text-3xl mt-1">Reset Your Password</h1>
        <p className="text-sm text-muted-foreground w-full mt-2">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password.
        </p>

        <div className="flex flex-col gap-3 mt-9 w-full max-w-sm">
          <h3 className="text-md text-muted-foreground">
            Enter Your Email Address
          </h3>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field
              name="email"
              validators={{ onChange: forgotPasswordZodSchema.shape.email }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <KeyRound
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      id={field.name}
                      type="email"
                      placeholder="you@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="pl-9"
                      autoComplete="email"
                    />
                  </div>

                  {field.state.meta.errors?.[0] && (
                    <p role="alert" className="text-sm text-destructive ml-1">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Button
              disabled={isPending}
              type="submit"
              variant="secondary"
              size="xl"
              className="w-fit justify-start gap-3 mt-5"
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  Send Reset Link <ArrowRight />
                </>
              )}
            </Button>

            {isError && (
              <p className="text-red-500 mt-2 px-1">
                {(error as any)?.message || "Something went wrong"}
              </p>
            )}
          </form>
        </div>

        <p className="text-sm text-muted-foreground w-full mt-9">
          Remember your password?{" "}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/login")}
            className="text-orange-500 px-1"
          >
            Back to Login
          </Button>
        </p>
      </div>
    </div>
  );
}
