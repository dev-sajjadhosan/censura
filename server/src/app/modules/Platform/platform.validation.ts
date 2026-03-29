import { z } from "zod";

const createPlatformSchema = z.object({
  name: z.string().min(1, "Platform name is required"),
  slug: z.string().min(1, "Platform slug is required"),
  description: z.string().optional(),
  url: z.string().optional(),
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
  icon: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const updatePlatformSchema = z.object({
  name: z.string().min(1, "Platform name is required").optional(),
  slug: z.string().min(1, "Platform slug is required").optional(),
  description: z.string().optional(),
  url: z.string().optional(),
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
  icon: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const PlatformValidation = {
  createPlatformSchema,
  updatePlatformSchema,
};
