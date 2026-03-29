import { z } from "zod";

export const createPlatformSchema = z.object({
  name: z.string().min(1, "Platform name is required"),
  slug: z.string().min(1, "Platform slug is required"),
  description: z.string().min(1, "Platform description is required"),
  icon: z.string("Icon is required"),
  url: z.string("URL is required"),
  type: z.string("Type is required"),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const updatePlatformSchema = createPlatformSchema.partial().extend({
  name: z.string().min(1, "Platform name is required").optional(),
  slug: z.string().min(1, "Platform slug is required").optional(),
  description: z.string().min(1, "Platform description is required").optional(),
  icon: z.string("Icon is required").optional(),
  url: z.string("URL is required").optional(),
  type: z.string("Type is required").optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type CreatePlatformInput = z.infer<typeof createPlatformSchema>;
export type UpdatePlatformInput = z.infer<typeof updatePlatformSchema>;
