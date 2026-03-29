import {
  getMediaBySlug,
  getMediaReviews,
  addToWatchlist,
  removeFromWatchlist,
  getMyMediaPurchases,
} from "@/services/media.service";
import MediaActions from "@/components/Modules/Media/MediaActions";
import { getCurrentUser } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  Calendar,
  Film,
  Bookmark,
  ShoppingCart,
  MessageSquare,
  ThumbsUp,
  Video,
  History,
  Share2,
  BookmarkPlus,
  Clapperboard,
  ChevronRight,
  Link2,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewSection from "@/components/Modules/Media/ReviewForm";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DialogShowPlatfroms from "@/components/Modules/Media/DialogShowPlatfroms";
import { Cast, MediaPlatform, Platform } from "@/types/media.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: media } = await getMediaBySlug(slug);
  const reviews = media.reviews;
  console.log("response of single media: ", media);

  const user = await getCurrentUser();

  let hasPurchased = false;
  if (user && media.pricing !== "FREE") {
    try {
      const res = (await getMyMediaPurchases()) as any;
      const purchases = res?.data || [];
      hasPurchased = purchases.some((p: any) => p.mediaId === media.id);
    } catch (e) {}
  }

  const initialIsBookmarked =
    media?.bookmarks?.some((b: any) => b.userId === user?.id) || false;

  return (
    <div className="min-h-screen bg-black text-white mt-10">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <Image
            width={1920}
            height={1080}
            src={
              media.backdropUrl ||
              media.posterUrl ||
              "https://placehold.co/1920x1080"
            }
            alt={media.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative container mx-auto h-full flex flex-col justify-end pb-12 px-4">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="hidden md:block w-lg h-95 rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
              <Image
                width={900}
                height={1200}
                src={media.posterUrl}
                alt={media.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 text-primary text-sm px-4 py-4 font-bold uppercase tracking-wider">
                    {media.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {media.avgRating?.toFixed(1) || "N/A"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size={"icon-lg"} variant={"ghost"}>
                    <Share2 />
                  </Button>
                  <Button size={"icon-lg"} variant={"ghost"}>
                    <BookmarkPlus />
                  </Button>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">{media.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-neutral-300 text-sm">
                <Badge className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {media.releaseYear}
                </Badge>
                {media.runtimeMinutes && (
                  <Badge
                    variant={"secondary"}
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    {media.runtimeMinutes} min
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  {media.director}
                </div>
              </div>
              <p className="max-w-2xl text-md text-neutral-300 line-clamp-3">
                {media.synopsis}
              </p>

              <MediaActions
                media={media}
                hasPurchasedInitial={hasPurchased}
                user={user}
                initialIsBookmarked={initialIsBookmarked}
              />
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
              <p className="text-neutral-400 leading-relaxed text-md">
                {media.synopsis}
              </p>
            </section>

            <div className="w-full h-full">
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="flex flex-col h-full">
                {media.cast?.length === 0 ? (
                  <div className=" h-60 rounded-xl flex flex-col items-center justify-center py-10 bg-secondary/35">
                    <Users2 className="size-7 text-muted-foreground mb-2" />
                    <h3 className="text-xl">No Cast</h3>
                    <p className="text-muted-foreground">
                      {" "}
                      No cast members found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {media.cast?.map((cast: Cast) => (
                      <div
                        key={cast.id}
                        className="p-5 rounded-xl bg-secondary/15 hover:bg-secondary/55 flex flex-col"
                      >
                        <Avatar className="size-25 mx-auto">
                          <AvatarImage src={cast.image} />
                          <AvatarFallback>
                            {cast.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="mt-3 flex flex-col gap-2 items-center justify-between">
                          <p className="font-medium text-neutral-200">
                            {cast.name}
                          </p>
                          <Badge className="text-xs uppercase tracking-tighter px-3 py-3">
                            {cast.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8">
            <section className="bg-neutral-900/30 p-6 rounded-xl border border-neutral-800/50">
              <h3 className="text-lg mb-4 italic text-primary/80">
                Reviews Summary
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Average Rating</span>
                  <span className="text-2xl font-bold text-yellow-500">
                    {media.avgRating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Total Reviews</span>
                  <span className="font-medium">
                    {media.reviewCount || "00"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Total Views</span>
                  <span className="font-medium">{media.viewCount || "00"}</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold">Available On</h3>
              <div className="flex flex-wrap gap-3">
                {media.platforms?.slice(0, 5)?.map((p: MediaPlatform) => (
                  <div
                    key={p.id}
                    className="bg-secondary/15 hover:bg-secondary/65 px-4 py-4 flex items-center gap-3 rounded-xl"
                  >
                    <Clapperboard className="size-5 text-orange-500" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {p.platform.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.platform.type}
                      </span>
                    </div>
                    <Link
                      href={p.platform.url || "#"}
                      target="_blank"
                      className="ml-auto"
                    >
                      <Button variant="ghost" size="icon">
                        <Link2 />
                      </Button>
                    </Link>
                  </div>
                ))}
                {media.platforms?.length > 5 && (
                  <DialogShowPlatfroms
                    platforms={media.platforms.map((p) => p.platform)}
                    title={
                      <div className="bg-secondary/65 px-6 py-4 flex items-center gap-3 rounded-xl [&_svg]:size-4 hover:[&_svg]:translate-x-2 [&_svg]:duration-100">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            +{media.platforms?.length - 5} more
                          </span>
                        </div>
                        <ChevronRight />
                      </div>
                    }
                  />
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="pt-8">
          <h3 className="text-lg">Write Your Review Here</h3>
          <p className="text-sm text-muted-foreground">
            Share your thoughts and help others decide
          </p>
          <ReviewSection
            mediaId={media.id}
            initialReviews={reviews}
            user={user}
          />
        </section>
      </div>
    </div>
  );
}
