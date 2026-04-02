"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type INewsletterProps = z.infer<typeof newsletterSchema>;

const perks = [
  "Editor's Pick every morning",
  "New releases & hidden gems",
  "Zero spam, unsubscribe anytime",
];

export default function NewsletterSection() {
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (payload: INewsletterProps) => {
      // 👇 Replace with your actual server action
      await new Promise((r) => setTimeout(r, 1000));
      return payload;
    },
    onSuccess: () => {
      toast.success("You're in! First drop lands tomorrow morning.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong. Try again.");
    },
  });

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      try {
        if (!isSuccess) await mutateAsync(value);
      } catch (e: any) {
        console.error(e.message);
      }
    },
  });

  return (
    <section className="px-6 md:px-12 py-20 border-t border-white/5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — copy */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Daily digest
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-4">
            Your daily
            <br />
            dose of <span className="text-orange-500">cinema.</span>
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
            One email a day. New releases, hidden gems, and Editor&apos;s Picks
            curated by our team — straight to your inbox before you even wake
            up.
          </p>

          <ul className="flex flex-col gap-3">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form or success */}
        <div className="flex flex-col gap-6">
          {isSuccess ? (
            <div className="p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-13 h-11 rounded-xl flex items-center justify-center">
                <Sparkles size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-base mb-1">
                  You&apos;re subscribed.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Welcome to the digest. Your first drop lands tomorrow morning.
                  Check your inbox to confirm.
                </p>
              </div>
              <button
                onClick={() => form.reset()}
                className="text-xs text-orange-500 hover:opacity-80 transition-opacity w-fit underline underline-offset-4"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-accent/20">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
                Join 00,000+ subscribers
              </p>

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
                  validators={{ onChange: newsletterSchema.shape.email }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="bg-background"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors?.[0] && (
                          <p className="text-xs text-destructive ml-1">
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
                  size="lg"
                  className="w-full gap-2 justify-center"
                >
                  {isPending ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <>
                      Subscribe for free <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
                By subscribing you agree to our{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                . Unsubscribe anytime.
              </p>
            </div>
          )}

          {/* Social proof */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex -space-x-2">
              {["C", "A", "N", "-", "S", "U", "R", "A"].map((initial, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-background bg-accent flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                >
                  {initial}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">00,000+</span>{" "}
              Already subscribed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
