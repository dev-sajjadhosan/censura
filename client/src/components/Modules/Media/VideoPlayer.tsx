// components/Modules/Media/VideoPlayer.tsx
"use client";
import { useState } from "react";
import { Play } from "lucide-react";

export default function VideoPlayer({ url }: { url: string | null }) {
  const [playing, setPlaying] = useState(false);

  if (!url) {
    return (
      <div className="w-full aspect-video bg-neutral-900 rounded-xl flex items-center justify-center">
        <p className="text-neutral-500">No video available</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      {playing ? (
        <video
          src={url}
          controls
          autoPlay
          className="w-full h-full"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="w-full h-full flex items-center justify-center group"
        >
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </button>
      )}
    </div>
  );
}