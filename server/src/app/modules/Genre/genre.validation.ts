import { z } from "zod";

const createGenreSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Genre name is required",
    }),
  }),
});

const updateGenreSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Genre name is required",
    }),
  }),
});

export const GenreValidation = {
  createGenreSchema,
  updateGenreSchema,
};
