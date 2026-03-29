import { z } from "zod";

export const createMediaValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  type: z.string().min(1, "Type is required"),
  release: z.string().min(1, "Release year is required"),
  director: z.string().min(1, "Director is required"),
  poster: z.string().min(1, "Poster URL is required"),
  backdrop: z.string().min(1, "Backdrop URL is required"),
  trailer: z.string().min(1, "Trailer URL is required"),
  streaming: z.string().min(1, "Streaming URL is required"),
  runtime: z.string().min(1, "Runtime is required"),
  seasons: z.string().min(1, "Seasons is required"),
  pricing: z.string().min(1, "Pricing is required"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  cast: z.array(z.string()).min(1, "Cast is required").optional(),
  genres: z.array(z.string()).min(1, "Genres is required").optional(),
  platforms: z.array(z.string()).min(1, "Platforms is required").optional(),
});

export const updateMediaValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  type: z.string().min(1, "Type is required"),
  release: z.number().min(1, "Release year is required"),
  director: z.string().min(1, "Director is required"),
  poster: z.string().min(1, "Poster URL is required"),
  backdrop: z.string().min(1, "Backdrop URL is required"),
  trailer: z.string().min(1, "Trailer URL is required"),
  streaming: z.string().min(1, "Streaming URL is required"),
  runtime: z.number().min(1, "Runtime is required"),
  seasons: z.number().min(1, "Seasons is required"),
  pricing: z.string().min(1, "Pricing is required"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type CreateMediaValidationType = z.infer<
  typeof createMediaValidationSchema
>;
export type UpdateMediaValidationType = z.infer<
  typeof updateMediaValidationSchema
>;



const createCastValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().min(1, "Image URL is required"),
});

const createGenreValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image URL is required"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

const createPlatformValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  url: z.string().min(1, "URL is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon URL is required"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type CreateCastValidationType = z.infer<
  typeof createCastValidationSchema
>;
export type CreateGenreValidationType = z.infer<
  typeof createGenreValidationSchema
>;
export type CreatePlatformValidationType = z.infer<
  typeof createPlatformValidationSchema
>;
