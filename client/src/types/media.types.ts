import { User } from "./auth.types";
import { PlatformName, ReviewStatus } from "./enum.types";
import { Like } from "./reaction.types";

export interface Platform {
  id: string;
  name: string;
  slug: string;
  url: string;
  type: string;
  description?: string;
  icon?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;

  mediaPlatforms: MediaPlatform[];
}

export interface MediaPlatform {
  id: string;
  mediaId: string;
  platformId: string;
  platform: Platform;
  media: Media;

  createdAt: string;
  updatedAt: string;
}

export interface Cast {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isPublished: boolean;
  isFeatured: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  mediaId: string;

  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  mediaId: string;

  createdAt: string;
  updatedAt: string;
}

export interface MediaPurchase {
  id: string;
  userId: string;
  mediaId: string;
  amount: number;
  type: string;
  expiryDate: string;

  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  title: string;
  slug: string;
  type: string;
  synopsis: string;
  releaseYear: number;
  director: string;
  cast: Cast[];
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  streamingUrl: string;
  runtimeMinutes: number;
  seasons: number;
  pricing: string;
  isPublished: boolean;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  viewCount: number;
  likes: Like[];
  comments: Comment[];
  bookmarks: Bookmark[];
  favorites: Favorite[];
  purchases: MediaPurchase[];

  createdAt: string;
  updatedAt: string;
}

export interface Review {
  userId: string;
  mediaId: string;
  tags: string[];
  hasSpoiler: boolean;
  status: ReviewStatus;
  id: string;
  title: string;
  content: string;
  rating: number;
  user: User;
  likes: Like[];
  comments: Comment[];

  createdAt: string;
  updatedAt: string;
}
