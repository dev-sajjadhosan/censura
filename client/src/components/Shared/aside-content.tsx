"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AsideContentProps {
  data: any;
  // title?: string;
  // description?: string;
  align?: "left" | "right" | "center";
}

export default function AsideContent({
  data,
  align = "left",
}: AsideContentProps) {
  const [activeIndex, setActiveIndex] = useState(2); // Start with the middle one

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % data.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col p-7 w-full h-170 rounded-[2.5rem] overflow-hidden group transition-all duration-700">
      {/* Decorative Background Blobs */}
      {/* <div className="absolute -top-24 -left-24 w-96 h-96 bg-stone-500 rounded-full blur-[140px] opacity-25 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-120 h-120 bg-neutral-600 rounded-full blur-[160px] opacity-25 animate-pulse delay-700" /> */}
      {/* Texture Overlay */}
      {/* <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" /> */}

      <div className={`flex flex-col gap-1 text-${align}`}>
        <h1 className="text-lg">Hey there,</h1>
        <p className="text-xs text-muted-foreground">
          Connect with use. See what we have for you{" "}
          <span className="text-primary">here?</span>
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full h-full flex items-center justify-center perspective-[1000px] transform-style-3d overflow-visible">
        {data.map((item: any, index: number) => {
          const distance = index - activeIndex;
          const absDistance = Math.abs(distance);

          return (
            <div
              key={item.id}
              className={cn(
                "absolute w-[340px] h-100 md:h-[430px] transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) cursor-pointer rounded-[2rem] border border-white/10 group/card",
                absDistance === 0
                  ? "z-30"
                  : absDistance === 1
                    ? "z-20"
                    : "z-10",
              )}
              style={{
                transform: `
                  translateX(${distance * 220}px) 
                  translateZ(${absDistance * -250}px) 
                  rotateY(${distance * -35}deg)
                  scale(${1 - absDistance * 0.1})
                `,
                opacity: 1 - absDistance * 0.3,
                filter: `brightness(${1 - absDistance * 0.4}) blur(${absDistance * 2}px)`,
              }}
              onClick={() => setActiveIndex(index)}
            >
              {/* Card Inner with Glass Effect */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000"
                  priority={index === activeIndex}
                />

                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <div className="transform translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-100">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                      Premium Content
                    </span>
                    <h3 className="text-white text-2xl font-black tracking-tight uppercase leading-none">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Reflection/Shadow under active card */}
              {/* {absDistance === 0 && (
                <div className="absolute -bottom-16 inset-x-10 h-8 bg-blue-500/20 blur-3xl rounded-full" />
              )} */}
            </div>
          );
        })}
      </div>
      {/* Pagination & Controls */}
      <div className="absolute bottom-1 flex flex-col items-center gap-5 z-40 w-full">
        <div className="flex gap-3 px-6 py-3 bg-neutral-500/5 backdrop-blur-xl rounded-full border border-neutral-500/10">
          {data.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                activeIndex === index
                  ? "bg-primary/35 w-6"
                  : "bg-neutral-500 w-1.5 hover:bg-neutral-400",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
