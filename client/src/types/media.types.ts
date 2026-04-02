import { User } from "./auth.types";
import { PlatformName, ReviewStatus } from "./enum.types";
import { Payment } from "./payment.types";
import { Like } from "./reaction.types";

/**
 * 
 * {
  "id": "c4ec8beb-a95a-4c2a-a64a-f4f4cf9675de",
  "mediaId": "8a82b0ac-a677-427c-9bb6-37a38e07d603",
  "platformId": "07544a96-34db-41ad-8339-a6a28fec709a",
  "platform": {
    "id": "07544a96-34db-41ad-8339-a6a28fec709a",
    "name": "Netflix",
    "slug": "netflix",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia eos eligendi sunt voluptatibus velit a, recusandae magni laboriosam similique inventore, et placeat maiores. Hic, itaque!",
    "icon": "https://i.pinimg.com/736x/8f/8f/49/8f8f4940be98db59d6f99595a1292adf.jpg",
    "url": null,
    "type": null,
    "isFeatured": false,
    "isPublished": true,
    "createdAt": "2026-03-29T15:38:20.694Z",
    "updatedAt": "2026-03-29T15:38:20.694Z"
  }
}
 */

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
  id?: string;
  name: string;
  role: string;
  image?: string;

  createdAt?: string;
  updatedAt?: string;
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
  paymentId: string;
  type: string;
  status: string;
  price: number;
  expiresAt: string;
  stripePaymentId: string;

  user: User;
  media: Media;
  payment: Payment;

  createdAt: string;
  updatedAt: string;
}

export interface Rental {
  id: string;
  userId: string;
  mediaId: string;
  paymentId: string;
  type: string;
  status: string;
  price: number;
  expiresAt: string;
  stripePaymentId: string;

  user: User;
  media: Media;
  payments: Payment;

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
  rentalPrice: number;
  buyPrice: number;
  isPublished: boolean;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  viewCount: number;
  likes: Like[];
  comments: Comment[];
  bookmarks: Bookmark[];
  favorites: Favorite[];
  reviews: Review[];
  purchases: MediaPurchase[];

  genres: Genre[];
  platforms: MediaPlatform[];

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
  likes: Like[];
  comments: Comment[];

  user: User;
  media: Media;

  createdAt: string;
  updatedAt: string;
}
