"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 mb-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[40px] bg-secondary/40 px-8 py-20 md:px-16 md:py-24 text-center">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-8 text-primary/10 animate-pulse">
            <Sparkles className="size-48" />
          </div>
          <div className="absolute bottom-0 left-0 p-12 text-primary/5">
            <Sparkles className="size-32" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold text-primary mb-8 leading-tight">
              Ready to Share Your <br /> Cinematic Journey?
            </h2>
            <p className="text-xl text-primary/80 mb-12 leading-relaxed">
              Join thousands of reviewers today. Start rating, sharing, and discovering the best content across all platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="h-16 px-10 text-lg font-bold rounded-2xl group" asChild>
                <Link href="/register">
                  Get Started for Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold rounded-2xl bg-primary/5 border-primary/20 text-primary hover:bg-primary/10" asChild>
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
