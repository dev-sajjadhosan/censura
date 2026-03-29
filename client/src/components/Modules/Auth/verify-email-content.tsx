"use client";

import {
  resendOtpAction,
  verifyEmailAction,
} from "@/app/(auth-pages)/verify-email/_action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { IVerifyEmailProps, verifyEmailZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Loader,
  Mailbox,
  MailPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmailResendContext from "./email-resend-context";

/**
 * State definitions for the verification flow
 */
type VerificationUIState =
  | "EXPIRED"
  | "LOADING"
  | "SUCCESS"
  | "RESEND"
  | "OTP_INPUT";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { mutateAsync, isPending, error, isError } = useMutation({
    mutationFn: async (payload: IVerifyEmailProps) => {
      const res = await verifyEmailAction(payload);
      return res;
    },
  });

  const form = useForm({
    defaultValues: {
      email: email || "",
      otp: "",
    },
    onSubmit: async ({ value }) => {
      try {
        console.log("verify email value", value);
        const res = (await mutateAsync(value)) as any;
        console.log("verify email response", res);

        if (res.message === "Invalid OTP") {
          toast.warning("Invalid OTP. Please try again.");
          return;
        }

        if (res.user.emailVerified) {
          toast.success("Email verified successfully!");
          return router.push("/profile");
        } else {
          toast.error(res?.message);
        }
      } catch (error: any) {
        console.log("verify email error", error.message);
      }
    },
  });

  return (
    <div className="h-full flex items-center">
      <div className="flex flex-col items-start justify-center gap-1 w-2xl">
        <Badge variant="outline" className="px-4 py-4">
          UNVERIFIED EMAIL
        </Badge>
        <h1 className="text-3xl mt-1">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground w-full mt-2">
          We have sent a verification code to your email address. The
          verification code will expire in 5 minutes.
        </p>

        <div className="flex flex-col gap-3 mt-9">
          <h3 className="text-md text-muted-foreground">
            Enter Verification Code
          </h3>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="otp"
              validators={{ onChange: verifyEmailZodSchema.shape.otp }}
            >
              {(field) => (
                <>
                  <InputOTP
                    maxLength={6}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  {field.state.meta.errors?.[0] && (
                    <p
                      role="alert"
                      className="text-sm text-destructive mt-3 ml-2"
                    >
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </>
              )}
            </form.Field>

            <Button
              disabled={isPending}
              type="submit"
              variant="secondary"
              size="xl"
              className="w-fit justify-start gap-3 mt-9"
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  Verify OTP <ArrowRight />
                </>
              )}
            </Button>

            {isError && (
              <p className="text-red-500 mt-5 px-5">
                {error?.message || "Something went wrong"}
              </p>
            )}
          </form>
        </div>

        <p className="text-sm text-muted-foreground w-full mt-9">
          If you don't receive a verification code, click{" "}
          <Link
            href={`/verify-email?email=${email}&resend=true`}
            className="text-orange-500"
          >
            here
          </Link>{" "}
          to resend the code.
        </p>
      </div>
    </div>
  );
}
