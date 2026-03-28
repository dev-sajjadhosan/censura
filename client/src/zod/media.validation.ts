import { z } from "zod";

export const createMediaValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  type: z.string().min(1, "Type is required"),
  release: z.number().min(1, "Release year is required"),
  director: z.string().min(1, "Director is required"),
  cast: z.array(z.string()).min(1, "Cast is required"),
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
