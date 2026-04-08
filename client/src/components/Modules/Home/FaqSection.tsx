"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI recommendation work?",
    answer:
      "Our recommendation engine, internally codenamed 'Aura,' operates on a hybrid model that combines Content-Based Filtering with Deep Collaborative Filtering. Unlike basic algorithms that suggest a movie just because it’s 'Action,' Aura creates a high-dimensional vector of your cinematic taste. It tracks variables such as your affinity for specific screenwriters, the visual 'mood' of cinematography you prefer, and even the narrative pacing—noting whether you prefer slow-burn character studies or high-octane plots. By processing your interaction data—such as what you skip, what you rewatch, and how your ratings evolve over time—Aura identifies 'taste-clusters' within our global community. This means you aren't just getting popular hits; you’re being introduced to hidden indie gems and international titles that statistically align with your subconscious preferences. As you interact more with the platform, the algorithm refines its accuracy, effectively eliminating the 'paradox of choice' and ensuring that your limited relaxation time is spent on high-quality content that resonates with you on a personal level.",
  },
  {
    question: "Can I review movies for free?",
    answer:
      "Absolutely. We believe that film criticism should be a democratic dialogue, not a closed conversation reserved for elite publications. Every user who signs up for Censura gains immediate, permanent access to our core suite of social tools. This includes the ability to write unlimited long-form reviews, assign granular ratings on our proprietary 10-point scale, and organize your viewing history into public or private watchlists. By keeping these features free, we ensure that our 'Global Community Score' remains a true reflection of the general public's sentiment, providing an essential counter-perspective to professional critics. Furthermore, your free account allows you to follow other cinephiles, engage in comment-section debates, and contribute to our community-sourced database of trivia and filming locations. We are committed to maintaining this 'Free-Forever' tier for the social aspects of the platform because we believe that the more voices we have in our ecosystem, the richer and more reliable our data becomes for everyone involved.",
  },
  {
    question: "What is the benefit of a premium subscription?",
    answer:
      "Censura Pro is designed specifically for the 'Power Cinephile' who views film not just as entertainment, but as a passion to be tracked and analyzed. While the core experience remains free, Pro members unlock a sophisticated layer of 'Cine-Analytics.' This includes a personalized Year-in-Review dashboard that visualizes your viewing habits through heatmaps of your most-watched decades, genre-diversity charts, and 'Director Affinity' metrics that reveal which creators truly dominate your taste. Beyond the data, Pro status removes all third-party advertisements, providing a sleek, cinematic interface that lets the movie posters and trailers shine. You also gain 'Verified Reviewer' status, which applies a badge to your profile and prioritizes your reviews in the global feed, ensuring your voice reaches a wider audience. Perhaps most importantly, Pro members get early access to our 'Beta Lab' features—such as our upcoming AI-powered video essay generator and group-watch synchronization tools—allowing you to help shape the technical roadmap of the platform itself.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "We are currently in a transitional phase between our high-performance web platform and a native mobile ecosystem. At present, Censura is built as a 'Mobile-First' Progressive Web App (PWA). This means that if you visit our site on Safari or Chrome and select 'Add to Home Screen,' you will experience an app-like interface with fast loading times and smooth transitions without needing a traditional download. However, recognizing the demand for deeper integration, our engineering team is actively developing native applications for both iOS and Android, currently slated for a Q4 2026 launch. These native versions will introduce features that web browsers simply cannot support, such as 'Offline Mode'—allowing you to manage your watchlists and draft reviews while on a flight or in areas with poor connectivity. They will also feature advanced push notifications that alert you the second a film on your 'Most Anticipated' list hits a streaming service you subscribe to, along with integrated haptic feedback for a more tactile rating experience. We are building for the long term, ensuring that when the app drops, it is the most stable and feature-rich tool in your digital library.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-24 bg-secondary/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the Censura platform.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border rounded-2xl px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-bold py-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
