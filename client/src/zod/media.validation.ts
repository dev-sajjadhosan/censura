import { z } from "zod";

export const createMediaValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  type: z.string().min(1, "Type is required"),
  releaseYear: z.string().min(1, "Release year is required"),
  director: z.string().min(1, "Director is required"),
  posterUrl: z.string().min(1, "Poster URL is required"),
  backdropUrl: z.string().min(1, "Backdrop URL is required"),
  trailerUrl: z.string().min(1, "Trailer URL is required"),
  streamingUrl: z.string().min(1, "Streaming URL is required"),
  runtimeMinutes: z.string().min(1, "Runtime is required"),
  seasons: z.string().min(1, "Seasons is required"),
  pricing: z.string().min(1, "Pricing is required"),
  rentalPrice: z.string().min(1, "Rental price is required"), // Added
  buyPrice: z.string().min(1, "Buy price is required"), // Added
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  // cast: z.array(z.object()).min(1, "Cast is required").optional(),
  // genres: z.array(z.object()).min(1, "Genres is required").optional(),
  // platforms: z.array(z.object()).min(1, "Platforms is required").optional(),
});

export const updateMediaValidationSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  synopsis: z.string().min(1, "Synopsis is required").optional(),
  type: z.string().min(1, "Type is required").optional(),
  releaseYear: z.number().min(1, "Release year is required").optional(),
  director: z.string().min(1, "Director is required").optional(),
  posterUrl: z.string().min(1, "Poster URL is required").optional(),
  backdropUrl: z.string().min(1, "Backdrop URL is required").optional(),
  trailerUrl: z.string().min(1, "Trailer URL is required").optional(),
  streamingUrl: z.string().min(1, "Streaming URL is required").optional(),
  runtimeMinutes: z.number().min(1, "Runtime is required").optional(),
  seasons: z.number().min(1, "Seasons is required").optional(),
  pricing: z.string().min(1, "Pricing is required").optional(),
  isPublished: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
});

export type CreateMediaValidationType = z.infer<
  typeof createMediaValidationSchema
>;
export type UpdateMediaValidationType = z.infer<
  typeof updateMediaValidationSchema
>;



export const createCastValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().min(1, "Image URL is required"),
});

export type CreateCastValidationType = z.infer<
  typeof createCastValidationSchema
>;
