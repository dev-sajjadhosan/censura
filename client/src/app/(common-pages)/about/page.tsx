"use client"
import { getSubscriptionPlans } from "@/services/subscription.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { num: "00K+", label: "Registered users" },
  { num: "00K+", label: "Reviews written" },
  { num: "1–10", label: "Precision rating scale" },
  { num: "0", label: "Paid placements" },
];

const values = [
  {
    title: "Authentic reviews only",
    desc: "Every review goes through admin moderation. No bot farms, no paid promotion, no astroturfing.",
  },
  {
    title: "Spoiler-free by default",
    desc: "Our community guidelines and moderation keep spoilers flagged and hidden behind explicit opt-in.",
  },
  {
    title: "Your data, your control",
    desc: "Cancel anytime. Export your reviews. No dark patterns, no lock-in.",
  },
];

const features = [
  {
    icon: "★",
    title: "Precision 1–10 ratings",
    desc: `Not just thumbs up or stars — a full 10-point scale lets you express exactly how you felt. Add tags like "Underrated" or "Overrated" for nuance.`,
  },
  {
    icon: "◈",
    title: "Smart watchlist",
    desc: "Track what you want to see next. Get notified when Editor's Picks drop. Never lose a recommendation again.",
  },
  {
    icon: "⊕",
    title: "Threaded comments",
    desc: "Discuss scene-by-scene with other viewers. React, reply, and build context around every review.",
  },
  {
    icon: "◉",
    title: "Admin-moderated content",
    desc: "Our team reviews every submission. If it doesn't meet the standard, it doesn't go live — period.",
  },
];


const techStack = [
  "Next.js 15 (App Router)",
  "TypeScript",
  "Prisma ORM",
  "PostgreSQL",
  "Better Auth",
  "TanStack Query",
  "Tailwind CSS",
  "Stripe",
  "Cloudinary",
  "Zod",
];

export default function AboutPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => getSubscriptionPlans(),
  });

  const plans = data?.data;
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-8 md:px-12 py-16 border-b border-white/5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-white/20" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            About Censura
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-medium leading-tight mb-5">
          Cinema deserves
          <br />
          honest <span className="text-orange-500">criticism.</span>
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
          Censura (Latin for critical judgment) is a community-driven media
          review platform where every rating, every review, and every comment is
          held to a higher standard.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-8 md:px-10 py-8 ${i < stats.length - 1 ? "border-r border-white/5" : ""}`}
          >
            <p className="font-serif text-4xl font-medium text-orange-500 leading-none mb-1">
              {stat.num}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-white/5">
        <div className="px-8 md:px-10 py-12 border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Our mission
          </p>
          <h2 className="font-serif text-3xl font-medium leading-snug mb-4">
            We built this for people who take film seriously.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Too many platforms either let anything through or are gated behind
            critics with no skin in the game. Censura sits in the middle — real
            users, real opinions, moderated by people who care about the craft.
          </p>
        </div>

        <div className="px-8 md:px-10 py-12 flex flex-col gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex items-start gap-3 p-4 border border-white/5 rounded-lg"
            >
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">{v.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 md:px-10 py-12 border-b border-white/5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          What you get
        </p>
        <h2 className="font-serif text-3xl font-medium mb-8">
          Every feature, purposefully built.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/5 rounded-xl overflow-hidden">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`p-7 bg-background ${
                i % 2 === 0 ? "border-r border-white/5" : ""
              } ${i < 2 ? "border-b border-white/5" : ""}`}
            >
              <p className="text-xl mb-3">{f.icon}</p>
              <p className="text-sm font-medium mb-2">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-white/5">
        {plans?.map((plan, i) => (
          <div
            key={plan.name}
            className={`px-8 md:px-10 py-10 ${
              plan?.features ? "bg-accent/30" : ""
            } ${i < plans.length - 1 ? "border-b md:border-b-0 md:border-r border-white/5" : ""}`}
          >
            {plan.badge && (
              <span className="inline-block text-[10px] uppercase tracking-widest text-orange-500 border border-orange-500/40 rounded-full px-3 py-1 mb-4">
                {plan.badge}
              </span>
            )}
            <p className="text-lg font-medium mb-1">{plan.name}</p>
            <p className="font-serif text-4xl font-medium mb-1">{plan.price}</p>
            {/* <p className="text-xs text-muted-foreground mb-6">{plan?.name}</p> */}
            <ul className="flex flex-col gap-2 mt-5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className={`text-xs flex items-center gap-2 ${
                    plan?.features ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full shrink-0 ${
                      plan?.features ? "bg-orange-500" : "bg-muted-foreground"
                    }`}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Tech Stack */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8 md:px-10 py-12 border-b border-white/5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Under the hood
          </p>
          <h2 className="font-serif text-3xl font-medium mb-3">
            Built for performance.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Server-rendered pages, optimistic UI updates, and a Prisma-powered
            database ensure every interaction feels instant.
          </p>
        </div>
        <div className="md:col-span-2 flex items-center">
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-4 py-2 border border-white/10 rounded-full text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
          Ready to watch
          <br />
          with <span className="text-orange-500">purpose?</span>
        </h2>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-medium rounded-lg shrink-0"
        >
          Start for free <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
