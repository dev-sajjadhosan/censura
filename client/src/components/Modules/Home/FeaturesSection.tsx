"use client";

import { Brain, Search, MessageSquare, Zap, Sparkles, TrendingUp } from "lucide-react";

const features = [
  {
    title: "AI Search Suggestions",
    description: "Our intelligent engine predicts what you're looking for before you even finish typing.",
    icon: Search,
  },
  {
    title: "Smart Recommendations",
    description: "Personalized content tailored to your unique taste and viewing history.",
    icon: Brain,
  },
  {
    title: "AI Chat Assistant",
    description: "Have a conversation with our bot to find the perfect movie for your mood.",
    icon: MessageSquare,
  },
  {
    title: "Real-time Analytics",
    description: "See what's trending across the globe with our live activity tracking.",
    icon: TrendingUp,
  },
  {
    title: "Instant Filters",
    description: "Switch between genres, ratings, and platforms in a heartbeat.",
    icon: Zap,
  },
  {
    title: "Curated Collections",
    description: "Expertly picked titles that match specific themes and cinematic styles.",
    icon: Sparkles,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Core Features</h2>
          <h3 className="text-4xl md:text-5xl font-bold leading-tight">
            Intelligent Reviewing <br className="hidden md:block" />
            <span className="text-muted-foreground italic">Experience Powered by AI</span>
          </h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-6 group">
              <div className="shrink-0">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="size-5.5" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
