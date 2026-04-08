"use client";

import { MessageCircle, Mail, Phone, HelpCircle, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-secondary/40 pt-32 pb-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">How can we help?</h1>
        <p className="text-primary/70 text-lg mb-12 max-w-2xl mx-auto">
          Search our knowledge base or get in touch with our team for personalized assistance.
        </p>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="h-16 pl-12 pr-4 bg-primary/5 text-primary text-lg rounded-2xl border-0" 
            placeholder="Search for articles..." 
          />
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 border-muted hover:border-primary/50 transition-all text-center">
            <div className="size-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="size-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Chat</h3>
            <p className="text-muted-foreground mb-6">Speak with our support team instantly during business hours.</p>
            <Button variant="outline" className="rounded-full">Start Chat</Button>
          </Card>
          <Card className="p-8 border-muted hover:border-primary/50 transition-all text-center">
            <div className="size-16 rounded-3xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-6">
              <Mail className="size-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Email Support</h3>
            <p className="text-muted-foreground mb-6">Send us a message and we'll get back to you within 24 hours.</p>
            <Button variant="outline" className="rounded-full">Send Email</Button>
          </Card>
          <Card className="p-8 border-muted hover:border-primary/50 transition-all text-center">
            <div className="size-16 rounded-3xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6">
              <Phone className="size-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Phone Support</h3>
            <p className="text-muted-foreground mb-6">Call us directly for urgent technical or billing issues.</p>
            <Button variant="outline" className="rounded-full">+1 (555) 000-0000</Button>
          </Card>
        </div>

        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Popular Topics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Managing Your Subscription", icon: HelpCircle },
              { title: "Review Guidelines & Policies", icon: FileText },
              { title: "Troubleshooting Login Issues", icon: HelpCircle },
              { title: "API Integration Guide", icon: FileText },
            ].map((topic, i) => (
              <div key={i} className="flex items-center gap-4 p-6 rounded-2xl border hover:bg-secondary/20 cursor-pointer transition-colors">
                <topic.icon className="size-6 text-primary" />
                <span className="font-bold">{topic.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
