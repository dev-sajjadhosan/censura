import { z } from "zod";

export const createGenreSchema = z.object({
  name: z.string("Name must be a string").min(1, "Name is required"),
  slug: z.string("Slug must be a string").min(1, "Slug is required"),
  description: z.string("Description must be a string"),
  image: z.string("Image must be a valid URL"),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateGenreSchema = createGenreSchema.partial().extend({
  id: z.string(),
});

export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
