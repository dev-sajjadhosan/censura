import {
  getMediaBySlug,
  getMediaReviews,
  addToWatchlist,
  removeFromWatchlist,
} from "@/services/media.service";
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
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewSection from "@/components/Modules/Media/ReviewSection";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DialogShowPlatfroms from "@/components/Modules/Media/DialogShowPlatfroms";

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const mockMediaData: Record<string, any> = {
    "silent-shadows": {
      id: "mock-1",
      title: "The Silent Shadows",
      slug: "silent-shadows",
      posterUrl:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
      avgRating: 8.5,
      releaseYear: 2023,
      runtimeMinutes: 124,
      director: "Elena Rodriguez",
      type: "MOVIE",
      synopsis:
        "A gripping psychological thriller about a woman who discovers that her reflections have a life of their own. As she investigates the origins of this phenomenon, she uncovers a dark family secret that threatens to consume her reality.",
      cast: ["Sarah Jenkins", "Michael Chen", "David Oyelowo", "Emily Blunt"],
      reviewCount: 1250,
      platforms: [
        { id: "p1", platform: "Netflix", type: "SUBSCRIPTION" },
        { id: "p2", platform: "Prime Video", type: "RENTAL" },
        { id: "p3", platform: "Disney+", type: "BUY" },
        { id: "p4", platform: "Hulu", type: "SUBSCRIPTION" },
        { id: "p5", platform: "HBO Max", type: "BUY" },
        { id: "p6", platform: "Apple TV+", type: "RENTAL" },
        { id: "p7", platform: "Paramount+", type: "SUBSCRIPTION" },
        { id: "p8", platform: "Peacock", type: "BUY" },
        { id: "p9", platform: "Discovery+", type: "RENTAL" },
        { id: "p10", platform: "Showtime", type: "SUBSCRIPTION" },
      ],
      pricing: "FREE",
    },
    "nightfall-chronicles": {
      id: "mock-2",
      title: "Nightfall Chronicles",
      slug: "nightfall-chronicles",
      posterUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80",
      avgRating: 7.9,
      releaseYear: 2024,
      runtimeMinutes: 45,
      director: "Marcus Thorne",
      type: "SERIES",
      synopsis:
        "In a world where the sun never rises, a group of survivors must navigate the eternal darkness and the creatures that thrive within it. A tale of hope, betrayal, and the limits of human endurance.",
      cast: ["Jakob Wright", "Aria Stark", "Liam Neeson", "Zoe Saldana"],
      reviewCount: 3420,
      platforms: [
        { id: "p3", platform: "Disney+" },
        { id: "p4", platform: "HBO Max" },
      ],
      pricing: "PREMIUM",
    },
    "beyond-horizon": {
      id: "mock-3",
      title: "Beyond the Horizon",
      slug: "beyond-horizon",
      posterUrl:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&q=80",
      avgRating: 9.2,
      releaseYear: 2022,
      runtimeMinutes: 142,
      director: "Christopher Nolan",
      type: "MOVIE",
      synopsis:
        "An epic space odyssey that pushes the boundaries of time and space. When a team of explorers discovers a wormhole near Saturn, they embark on a journey that will determine the future of humanity.",
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      reviewCount: 15400,
      platforms: [{ id: "p2", platform: "Prime Video" }],
      pricing: "PURCHASE",
    },
    "digital-echoes": {
      id: "mock-4",
      title: "Digital Echoes",
      slug: "digital-echoes",
      posterUrl:
        "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&q=80",
      avgRating: 6.8,
      releaseYear: 2023,
      runtimeMinutes: 52,
      director: "Sophia Wang",
      type: "SERIES",
      synopsis:
        "A cyberpunk anthology series exploring the impact of advanced technology on human relationships and society. Each episode tells a standalone story in a shared neon-lit future.",
      cast: ["Ken Jeong", "Awkwafina", "Steven Yeun"],
      reviewCount: 890,
      platforms: [{ id: "p1", platform: "Netflix" }],
      pricing: "FREE",
    },
    "urban-legends": {
      id: "mock-5",
      title: "Urban Legends",
      slug: "urban-legends",
      posterUrl:
        "https://images.unsplash.com/photo-1542204172-658a09b60509?w=800&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1542204172-658a09b60509?w=1920&q=80",
      avgRating: 8.1,
      releaseYear: 2024,
      runtimeMinutes: 110,
      director: "Jordan Peele",
      type: "MOVIE",
      synopsis:
        "Modern myths come to life in this terrifying anthology film. From the man with the hook to the killer in the backseat, discover the truth behind the stories we tell in the dark.",
      cast: ["Daniel Kaluuya", "Keke Palmer", "Steven Yeun"],
      reviewCount: 2100,
      platforms: [{ id: "p4", platform: "HBO Max" }],
      pricing: "RENTAL",
    },
  };

  let media: any = mockMediaData[slug];

  if (!media) {
    try {
      const response = (await getMediaBySlug(slug)) as any;
      media = response.data;
    } catch (e) {
      return notFound();
    }
  }

  let reviews: any[] = [];
  if (!media.id.startsWith("mock-")) {
    try {
      const { data: reviewsData } = (await getMediaReviews(media.id)) as any;
      reviews = reviewsData;
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
    }
  } else {
    // Add 1 mock review for demonstration
    reviews = [
      {
        id: "mock-rev-1",
        rating: 9,
        content:
          "This was an absolutely mind-bending experience! The cinematography was top-notch and the acting was superb. Highly recommend to anyone who loves deep, atmospheric stories.",
        isSpoiler: false,
        tags: ["Must Watch", "Atmospheric"],
        user: { name: "CinematicFan" },
        createdAt: new Date().toISOString(),
        likesCount: 12,
        commentsCount: 2,
      },
    ];
  }

  const user = await getCurrentUser();

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
                <div className="flex items-center gap-4">
                  <Button size={"icon-lg"} variant={"ghost"}>
                    <Share2 />
                  </Button>
                  <Button size={"icon-lg"} className="gap-2">
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

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="gap-2">
                  Watch Now
                  <Video />
                </Button>
                <Button size="lg" variant="secondary" className="gap-2">
                  <History className="w-5 h-5" />
                  Add to Watchlist
                </Button>

                {media.pricing !== "FREE" && (
                  <Button size="lg">
                    <ShoppingCart />
                    {media.pricing === "RENTAL" ? "Rent" : "Buy"}
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
              <p className="text-neutral-400 leading-relaxed text-md">
                {media.synopsis}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {media.cast?.map((actor: string) => (
                  <div
                    key={actor}
                    className="p-5 rounded-xl bg-secondary/15 hover:bg-secondary/55 flex flex-col"
                  >
                    <div className=" w-full h-35 bg-secondary/25 rounded-xl mb-5" />
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-neutral-200">{actor}</p>
                      <Badge className="text-xs uppercase tracking-tighter px-3 py-3">
                        Actor
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
                  <span className="font-medium">
                    {media.viewsCount || "00"}
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold">Available On</h3>
              <div className="flex flex-wrap gap-3">
                {media.platforms?.slice(0, 5)?.map((p: any) => (
                  <div
                    key={p.id}
                    className="bg-secondary/15 hover:bg-secondary/65 px-4 py-4 flex items-center gap-3 rounded-xl"
                  >
                    <Clapperboard className="size-5 text-orange-500" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{p.platform}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.type}
                      </span>
                    </div>
                    <Link
                      href={p.url || "#"}
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
                    platforms={media.platforms}
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
            initialReviews={reviews || []}
            user={user}
          />
        </section>
      </div>
    </div>
  );
}
