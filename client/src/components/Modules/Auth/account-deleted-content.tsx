import Link from "next/link";
import { Ban, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountDeletedContent() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <Ban size={14} className="text-red-400" />
          {/* <div className="w-8 h-px bg-white/20" /> */}
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Account status
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-4">
          Your account
          <br />
          has been{" "}
          <span className="text-red-400">removed.</span>
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 w-1/2">
          This account has been deleted — either by you or by a Censura
          administrator following a policy violation.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-10 w-7/12">
          If you believe this was a mistake or want to appeal the decision,
          please contact our support team. We typically respond within 48 hours.
        </p>

        {/* What could have caused this */}
        <div className="border border-white/5 rounded-xl p-5 mb-8 bg-accent/10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Possible reasons
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "You requested account deletion from profile settings.",
              "The account violated Censura's community guidelines.",
              "Suspicious or fraudulent activity was detected.",
              "An administrator manually removed the account.",
            ].map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0 mt-1.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="gap-2"
          >
            <Link href="/contact-us">
              <Mail size={15} />
              Contact support
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft size={15} />
              Back to home
            </Link>
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground mt-10 leading-relaxed border-t border-white/5 pt-6">
          If you&apos;d like to start fresh,{" "}
          <Link
            href="/register"
            className="text-orange-500 underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            create a new account
          </Link>
          . Note that any previous reviews or data cannot be recovered.
        </p>

      </div>
    </div>
  );
}