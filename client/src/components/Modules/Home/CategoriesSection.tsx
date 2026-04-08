"use client";

import { Card } from "@/components/ui/card";
import { Film, Music, Tv, Gamepad2, Mic2, Theater } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Action", icon: Film, color: "bg-red-500/10 text-red-500", slug: "action" },
  { name: "Drama", icon: Theater, color: "bg-blue-500/10 text-blue-500", slug: "drama" },
  { name: "Sci-Fi", icon: Gamepad2, color: "bg-purple-500/10 text-purple-500", slug: "sci-fi" },
  { name: "Comedy", icon: Mic2, color: "bg-yellow-500/10 text-yellow-500", slug: "comedy" },
  { name: "Documentary", icon: Tv, color: "bg-green-500/10 text-green-500", slug: "documentary" },
  { name: "Horror", icon: Music, color: "bg-orange-500/10 text-orange-500", slug: "horror" },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find your next favorite title by browsing through our curated genres.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/explore?genre=${cat.slug}`}>
              <Card className="group p-6 text-center hover:border-primary transition-all duration-300 cursor-pointer bg-card shadow-sm hover:shadow-md dark:bg-card/50 dark:backdrop-blur-sm border-muted">
                <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="size-6" />
                </div>
                <h3 className="font-semibold text-sm">{cat.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
