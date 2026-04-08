"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Movie Critic",
    content: "Censura changed how I discover independent films. The AI suggestions are eerily accurate to my taste.",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Sarah Chen",
    role: "Casual Viewer",
    content: "The clean interface and detailed reviews make it my go-to platform for deciding what to watch on weekends.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Marcus Thorne",
    role: "Director",
    content: "Finally, a platform that respects the art of filmmaking with nuanced rating systems and community discussions.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-muted-foreground text-lg">
              Joined by thousands of cinephiles and critics around the world.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-secondary/30 border border-muted hover:border-primary/30 transition-all">
              <div className="flex gap-1 mb-6 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <p className="text-md  mb-8 leading-relaxed">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <Avatar className="size-12 border-2 border-primary/20">
                  <AvatarImage src={t.avatar} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            View All Testimonials
          </Button>
        </div>
      </div>
    </section>
  );
}
