import { getMediaBySlug } from "@/services/media.service";
import { getCurrentUser } from "@/services/user.service";
import { notFound } from "next/navigation";
import { Play, Plus, Share2, Star, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { slug } = await params;
  const { v: queryVideoId } = await searchParams;
  
  const { data: media } = await getMediaBySlug(slug);
  const user = await getCurrentUser();

  if (!media) return notFound();

  const videoId = queryVideoId || media.trailerUrl || "dQw4w9WgXcQ";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Cinematic Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative container mx-auto px-4 py-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href={`/media/${slug}`}>
            <Button variant="ghost" className="text-zinc-400 hover:text-white group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Details
            </Button>
          </Link>
          <Badge variant="outline" className="border-white/10 bg-white/5 backdrop-blur-md">
            Now Playing: {media.type}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PLAYER SECTION */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 ring-1 ring-white/10">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                title={media.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* INFO PANEL */}
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    {media.title}
                  </h1>
                  <p className="text-red-500 font-medium tracking-widest text-xs uppercase">
                    Directed by {media.director}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-zinc-500 font-bold">Rating</p>
                    <div className="flex items-center gap-1.5 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-xl font-bold">{media.avgRating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white text-black hover:bg-zinc-200 uppercase px-3">4K Ultra HD</Badge>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 uppercase">{media.releaseYear}</Badge>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 uppercase">{media.runtimeMinutes} MIN</Badge>
              </div>

              <p className="text-zinc-400 leading-relaxed text-sm md:text-base max-w-4xl">
                {media.synopsis}
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-red-600/20">
                  <Play className="w-4 h-4 mr-2 fill-current" /> Continue Watching
                </Button>
                <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 h-12">
                  <Plus className="w-4 h-4 mr-2" /> Watchlist
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border border-white/5">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* SIDEBAR: RELATED/CAST */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Info className="w-4 h-4" /> Top Cast
            </h3>
            <div className="space-y-3">
              {media.cast?.slice(0, 4).map((actor: any) => (
                <div key={actor.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={actor.image} alt={actor.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-red-500 transition-colors">{actor.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-medium">{actor.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-white/5" />

            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-600/20 to-transparent border border-red-600/20">
              <h4 className="text-xs font-black uppercase mb-1">Coming Soon</h4>
              <p className="text-[10px] text-zinc-400 mb-3">Behind the scenes footage for {media.title} drops next week.</p>
              <Button size="sm" variant="link" className="p-0 h-auto text-red-500 text-xs">Notify Me</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}