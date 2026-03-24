"use client";

import { verifyEmailAction } from "@/app/(auth-pages)/verify-email/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailContent() {
  const [isSend, setIsSend] = useState(true);
  const [time, setTime] = useState(0);
  const path = useSearchParams();
  const resend = path.get("resend");
  const email = path.get("email");

  const { mutateAsync, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: async (payload: IVerifyEmailProps) => {
      const res = await verifyEmailAction(payload);
      if (res && typeof res === "object" && "success" in res && !res.success) {
        throw new Error((res as any).message || "Verification failed");
      }
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
        console.log("verify email payload", value);
        const res = await mutateAsync(value);
        console.log("verify email res", res);
      } catch (error) {
        console.log("verify email error", error);
      }
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (resend) {
        setTime((prev) => {
          const next = prev + 1;
          if (next >= 300) {
            setIsSend(false);
            clearInterval(timer);
            return 300;
          }
          return next;
        });
      }
    }, 1000);
    return () => {
      clearInterval(timer);
      setTime(0);
    };
  }, []);

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-2 justify-center h-full">
        <Loader className="size-5 animate-spin" />
        <p className="text-md">Please wait...</p>
        <p className="text-sm text-muted-foreground">
          {" "}
          We are verifying your email...
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-2 justify-center h-full">
        <Check className="size-7 text-green-500" />
        <p className="text-md">Thank you for your patience!</p>
        <p className="text-sm text-muted-foreground text-center">
          We have verified your email address. <br /> Now we are redirecting you
          to the Profile page.
        </p>
      </div>
    );
  }

  if (resend) {
    return (
      <div className="flex flex-col items-start justify-center gap-5 w-2xl">
        <div className="flex items-center gap-2">
          <Mailbox className="size-9 text-orange-500" />
          <h1 className="text-2xl">Verification!</h1>
        </div>
        <p className="text-muted-foreground w-full">
          We have sent a verification mail to your email address. The
          Verification mail will expire in 24 hours.
        </p>
        <p className="text-muted-foreground w-full">
          Please check your inbox and click on the verification link to verify
          your email address.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <p className="text-xs text-muted-foreground">
            Resend mail after{" "}
            <span className="text-orange-500">{300 - time}s</span> out of 300s.
          </p>
          <Progress value={time} max={300} className="w-xs" />
        </div>
        <div className="mt-3 flex items-center gap-5">
          <Button
            variant="secondary"
            size={"xl"}
            className="w-50 gap-3"
            disabled={isSend}
          >
            <MailPlus />
            Resend Mail
          </Button>
          <Link href="/verify-email">
            <Button variant="link" size={"xl"} className="w-50 gap-3">
              Back to Verify Page
              <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-center gap-1 w-2xl">
      <Badge variant="outline" className="px-4 py-4">
        UNVARIFIED EMAIL
      </Badge>
      <h1 className="text-3xl mt-1">Verify Your Email</h1>
      <p className="text-sm text-muted-foreground w-full mt-2">
        We have sent a varification code to your email address. The varification
        code will expire in 5 minutes. Please check your inbox and enter the
        varification code to varify your email address.
      </p>
      <div className="flex flex-col gap-3 mt-9">
        <h3 className="text-md text-muted-foreground">
          Enter Varification Code
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
            validators={{
              onChange: verifyEmailZodSchema.shape.otp,
            }}
          >
            {(field) => (
              <>
                <InputOTP
                  maxLength={6}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
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

                {/* error lives inside the field, not on form.state */}
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
        <Link href="/verify-email?resend=true" className="text-orange-500">
          here
        </Link>{" "}
        to resend the code.
      </p>
    </div>
  );
}
