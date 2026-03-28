import { z } from "zod";

export const createPlatformSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  type: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional(),
});

export const updatePlatformSchema = createPlatformSchema.partial().extend({
  id: z.string(),
});

export type CreatePlatformInput = z.infer<typeof createPlatformSchema>;
export type UpdatePlatformInput = z.infer<typeof updatePlatformSchema>;
