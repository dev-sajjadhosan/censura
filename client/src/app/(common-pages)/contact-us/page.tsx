"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Github,
  Loader,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(4, "Subject must be at least 4 characters."),
  message: z.string().min(20, "Message must be at least 20 characters."),
});

type IContactProps = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: "Email us",
    value: "support@censura.dev",
    href: "mailto:support@censura.dev",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Dhaka, Bangladesh",
    href: null,
  },
  {
    icon: Github,
    label: "Open source",
    value: "github.com/censura",
    href: "https://github.com",
  },
];

const faqs = [
  {
    q: "How do I report a spoiler in a review?",
    a: "Use the flag icon on any review or comment. Our moderation team reviews all reports within 24 hours.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes — cancel from your profile settings. You keep access until the end of your billing period.",
  },
  {
    q: "How do I request a movie or series to be added?",
    a: `Use the contact form and select "Content Request" as the subject. Our admins review all requests weekly.`,
  },
  {
    q: "My account was flagged. What do I do?",
    a: "Send us an email with your username and we'll review the moderation decision within 48 hours.",
  },
];

export default function ContactPage() {
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (payload: IContactProps) => {
      await new Promise((r) => setTimeout(r, 1200));
      return payload;
    },
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send message. Try again.");
    },
  });

  const form = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    onSubmit: async ({ value }) => {
      try {
        if (!isSuccess) await mutateAsync(value);
      } catch (e: any) {
        console.error(e.message);
      }
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-8 md:px-12 py-16 border-b border-white/5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-white/20" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Get in touch
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-medium leading-tight mb-5">
          We actually <span className="text-orange-500">read</span>
          <br />
          your messages.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
          Whether it&apos;s a bug, a content request, a billing question, or
          just feedback — reach out. A real person responds within 24 hours.
        </p>
      </section>

      {/* Main grid: form + info */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-white/5">
        {/* Contact Form — takes 2 cols */}
        <div className="md:col-span-2 px-8 md:px-10 py-12 border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
            Send a message
          </p>

          {isSuccess ? (
            <div className="flex flex-col items-start gap-4 py-8">
              <Badge variant="outline" className="px-4 py-3">
                MESSAGE SENT
              </Badge>
              <h2 className="font-serif text-3xl font-medium">
                We&apos;ll be in touch.
              </h2>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Your message has been received. Expect a reply within 24 hours
                to the email address you provided.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="mt-4 gap-2"
                onClick={() => form.reset()}
              >
                Send another message <ArrowRight size={16} />
              </Button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-5 max-w-xl"
            >
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field
                  name="name"
                  validators={{ onChange: contactSchema.shape.name }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Full name
                      </label>
                      <Input
                        placeholder="Sajjad Hossain"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors?.[0] && (
                        <p className="text-xs text-destructive">
                          {field.state.meta.errors[0].message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="email"
                  validators={{ onChange: contactSchema.shape.email }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Email address
                      </label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors?.[0] && (
                        <p className="text-xs text-destructive">
                          {field.state.meta.errors[0].message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Subject */}
              <form.Field
                name="subject"
                validators={{ onChange: contactSchema.shape.subject }}
              >
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Subject
                    </label>
                    <Input
                      placeholder="Bug report, content request, billing..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-xs text-destructive">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Message */}
              <form.Field
                name="message"
                validators={{ onChange: contactSchema.shape.message }}
              >
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Message
                    </label>
                    <Textarea
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="resize-none"
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-xs text-destructive">
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
                className="w-fit gap-3 mt-2"
              >
                {isPending ? (
                  <Loader className="animate-spin" size={16} />
                ) : (
                  <>
                    Send message <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Contact Info sidebar */}
        <div className="px-8 md:px-10 py-12 flex flex-col gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Contact info
            </p>
            <div className="flex flex-col gap-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm hover:text-orange-500 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Response time
            </p>
            <div className="flex flex-col gap-3">
              {[
                { type: "General enquiries", time: "24 hours" },
                { type: "Billing issues", time: "12 hours" },
                { type: "Bug reports", time: "48 hours" },
              ].map((r) => (
                <div
                  key={r.type}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground text-xs">
                    {r.type}
                  </span>
                  <span className="text-xs border border-white/10 px-2 py-0.5 rounded-full">
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 md:px-12 py-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-white/20" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            FAQ
          </span>
        </div>
        <h2 className="font-serif text-3xl font-medium mb-10">
          Common questions.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-background p-7">
              <p className="text-sm font-medium mb-2 leading-snug">{faq.q}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
