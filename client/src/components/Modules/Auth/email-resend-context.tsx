import { resendOtpAction } from "@/app/(auth-pages)/verify-email/_action";
import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import { X } from "lucide-react";

export default async function EmailResendContext({
  email,
  errorMessage,
}: {
  email: string;
  errorMessage: string;
}) {
  const handleResendOtp = async () => {
    try {
      const res = (await resendOtpAction({
        email: email || "",
        type: "email-verification",
      })) as any;
      console.log("resend otp response", res);
    } catch (error: any) {
      console.log("resend otp error", error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 justify-center h-full">
        <h1 className="text-3xl mb-14 text-muted-foreground">Censura</h1>
        <X className="size-7 text-red-500" />
        <p className="text-md">Oops! {errorMessage}</p>
        <p className="text-sm text-muted-foreground mb-9">
          We are sorry, but it seems like your OTP is{" "}
          <span className="text-red-500">{errorMessage}</span>. <br />
          Please click on the resend button to get a new OTP.
        </p>
        <Button
          // href={`/verify-email?resend=true&email=${email}`}
          onClick={() => {
            // setIsVerified(false);
            // setErrorMessage("");
            handleResendOtp();
          }}
          //   disabled={}
          className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 text-sm"
        >
          <MailPlus className="size-5" />
          Resend Mail
        </Button>
      </div>
    </>
  );
}
