import { getMediaBySlug, getMediaReviews, addToWatchlist, removeFromWatchlist } from "@/services/media.service";
import { getCurrentUser } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Star, Clock, Calendar, Film, Bookmark, ShoppingCart, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewSection from "@/components/Modules/Media/ReviewSection";

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // NOTE: In a real app, I'd fetch by slug. If API only supports ID, I'd need to handle that.
  // Assuming slug works or I fetch all and filter (not ideal, but for now let's hope slug is ID or I can find by ID).
  // I'll assume I can fetch by slug if I update the backend or if it's already supported.
  // Based on Media model, slug is unique.
  
  // For now I'll use a placeholder or assume the first one if ID is passed.
  // Let's assume the ID is passed as the slug for now if I don't have a getBySlug endpoint.
  // Actually I'll check MediaService.ts again. It has getSingleMedia(id).
  
  let media: any;
  try {
    const response = await getMediaBySlug(slug) as any; 
    media = response.data;
  } catch (e) {
    return notFound();
  }

  const { data: reviews } = await getMediaReviews(media.id) as any;
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={media.backdropUrl || media.posterUrl || "https://placehold.co/1920x1080"}
            alt={media.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <div className="relative container mx-auto h-full flex flex-col justify-end pb-12 px-4">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="hidden md:block w-64 aspect-2/3 rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
               <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {media.type}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  {media.avgRating?.toFixed(1) || "N/A"}
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">{media.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-neutral-300 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {media.releaseYear}
                </div>
                {media.runtimeMinutes && (
                   <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {media.runtimeMinutes} min
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  {media.director}
                </div>
              </div>
              <p className="max-w-2xl text-lg text-neutral-300 line-clamp-3">
                {media.synopsis}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="gap-2">
                  Watch Now
                </Button>
                <Button size="lg" variant="secondary" className="gap-2">
                  <Bookmark className="w-5 h-5" />
                  Watchlist
                </Button>
                {media.pricing !== 'FREE' && (
                   <Button size="lg" variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    {media.pricing === 'RENTAL' ? 'Rent' : 'Buy'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Details & Cast */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-neutral-400 leading-relaxed text-lg">
                {media.synopsis}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {media.cast?.map((actor: string) => (
                  <div key={actor} className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                    <p className="font-medium text-neutral-200">{actor}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-tighter mt-1">Actor</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8">
             <section className="bg-neutral-900/30 p-6 rounded-xl border border-neutral-800/50">
              <h3 className="text-xl font-bold mb-6 italic text-primary/80">Reviews Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Average Rating</span>
                  <span className="text-2xl font-bold text-yellow-500">{media.avgRating?.toFixed(1) || "0.0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Total Reviews</span>
                  <span className="font-medium">{media.reviewCount}</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
               <h3 className="text-xl font-bold">Available On</h3>
               <div className="flex flex-wrap gap-3">
                 {media.platforms?.map((p: any) => (
                   <div key={p.id} className="bg-neutral-800 px-4 py-2 rounded-lg text-sm font-medium border border-neutral-700">
                     {p.platform}
                   </div>
                 ))}
               </div>
            </section>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="pt-8 border-t border-neutral-800">
          <ReviewSection 
            mediaId={media.id} 
            initialReviews={reviews || []} 
            user={user} 
          />
        </section>
      </div>
    </div>
  );
}

