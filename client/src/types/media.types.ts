import { User } from "./auth.types";
import { PlatformName, ReviewStatus } from "./enum.types";

export interface Platform {
  id: string;
  platform: PlatformName;
  type?: string;
  url?: string;
}

export interface Cast {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  mediaId: string;
}

export interface Favorite {
  id: string;
  userId: string;
  mediaId: string;
}

export interface MediaPurchase {
  id: string;
  userId: string;
  mediaId: string;
  amount: number;
  type: string;
  expiryDate: string;
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  mediaId: string;
  type: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  mediaId: string;
  media: Media;
  content: string;
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
  user: User;
  likes: Like[];
  comments: Comment[];
}
