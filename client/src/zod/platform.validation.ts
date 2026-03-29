import { z } from "zod";

export const createPlatformSchema = z.object({
  name: z.string().min(1, "Platform name is required"),
  slug: z.string().min(1, "Platform slug is required"),
  description: z.string().min(1, "Platform description is required"),
  icon: z.string("Icon is required").min(1, "Icon/Image is required"),
  url: z.url("URL is invalid"),
  type: z.enum([
    "FREE",
    "PREMIUM",
    "RENTAL",
    "BUY",
    "ONE_TIME",
    "FREE_WITH_ADS",
    "LIMITED_FREE",
    "SUBSCRIPTION",
  ]),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const updatePlatformSchema = createPlatformSchema.partial().extend({
  name: z.string().min(1, "Platform name is required").optional(),
  slug: z.string().min(1, "Platform slug is required").optional(),
  description: z.string().min(1, "Platform description is required").optional(),
  icon: z.string("Icon is required").optional(),
  url: z.url("URL is invalid").optional(),
  type: z
    .enum([
      "FREE",
      "PREMIUM",
      "RENTAL",
      "BUY",
      "ONE_TIME",
      "FREE_WITH_ADS",
      "LIMITED_FREE",
      "SUBSCRIPTION",
    ])
    .optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type CreatePlatformInput = z.infer<typeof createPlatformSchema>;
export type UpdatePlatformInput = z.infer<typeof updatePlatformSchema>;
