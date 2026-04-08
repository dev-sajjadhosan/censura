"use client";

import { Card } from "@/components/ui/card";
import { Shield, Lock, FileText, Scale } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Privacy Policy",
      icon: Shield,
      content: "We take your privacy seriously. This document outlines how we collect, use, and protect your personal information when you use the Censura platform.",
      items: [
        "Personal data collected: Name, email, and usage patterns.",
        "How we use it: To personalize your experience and improve AI recommendations.",
        "Data Sharing: We never sell your data to third parties.",
        "Security: Industry-standard encryption for all data storage."
      ]
    },
    {
      title: "Terms of Service",
      icon: Scale,
      content: "By using our platform, you agree to comply with our community guidelines and legal requirements.",
      items: [
        "User Conduct: No harassment or hate speech in reviews.",
        "Content Ownership: You retain rights to your reviews but grant us a license to display them.",
        "Subscription: Detailed terms for billing and cancellations.",
        "Liability: Limitation of liability for user-generated content."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Legal & Privacy</h1>
          <p className="text-muted-foreground text-lg">Last modified: April 2026</p>
        </div>

        <div className="grid gap-12">
          {sections.map((section, i) => (
            <Card key={i} className="p-10 border-muted bg-card/40 backdrop-blur-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 text-primary/5 -translate-y-1/2 translate-x-1/2">
                <section.icon className="size-64" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 text-primary">
                  <section.icon className="size-10" />
                  <h2 className="text-3xl font-bold">{section.title}</h2>
                </div>
                <p className="text-xl leading-relaxed mb-8 text-muted-foreground">
                  {section.content}
                </p>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex gap-4">
                      <div className="size-2 rounded-full bg-primary mt-2.5 shrink-0" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            If you have any questions about these terms, please contact our legal team at <a href="mailto:legal@censura.app" className="underline hover:text-primary">legal@censura.app</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
