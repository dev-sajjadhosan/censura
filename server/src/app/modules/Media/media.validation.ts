import { z } from "zod";

const createMediaValidation = z
  .object({
    title: z.string("Name is required"),
    synopsis: z.string("Synopsis is required"),
    type: z.enum([
      "MOVIE",
      "SERIES",
      "DRAMA",
      "ANIME",
      "CARTOON",
      "SHORT_FILM",
      "DOCUMENTARY",
      "TV_SHOW",
      "WEB_SERIES",
      "REALITY_SHOW",
      "TALK_SHOW",
      "GAME_SHOW",
      "NEWS_CHANNEL",
      "SPORTS_CHANNEL",
      "MUSIC_CHANNEL",
      "KIDS_CHANNEL",
      "LIFESTYLE_CHANNEL",
      "TRAVEL_CHANNEL",
      "FOOD_CHANNEL",
    ]),
    genre: z.array(z.string("Genre is required")),
    releaseYear: z.number("Release year is required"),
    director: z.string("Director is required"),
    cast: z.array(z.string("Cast is required")),
    platforms: z.array(z.string("Platforms is required")),
    posterUrl: z.string().optional(),
    streamingLink: z.string().optional(),
    pricing: z.enum(["FREE", "PREMIUM", "RENTAL"]),
    isEditorsPick: z.boolean().optional(),
    price: z.number("Price is required").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pricing === "RENTAL" || data.pricing === "PREMIUM") {
      if (data.price === undefined || data.price === null || data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Price is required for RENTAL and PREMIUM content. Must be greater than 0.",
          path: ["price"],
        });
      }
    }
  });

const updateMediaValidation = z
  .object({
    title: z.string("Name is required").optional(),
    synopsis: z.string("Synopsis is required").optional(),
    type: z
      .enum([
        "MOVIE",
        "SERIES",
        "DRAMA",
        "ANIME",
        "CARTOON",
        "SHORT_FILM",
        "DOCUMENTARY",
        "TV_SHOW",
        "WEB_SERIES",
        "REALITY_SHOW",
        "TALK_SHOW",
        "GAME_SHOW",
        "NEWS_CHANNEL",
        "SPORTS_CHANNEL",
        "MUSIC_CHANNEL",
        "KIDS_CHANNEL",
        "LIFESTYLE_CHANNEL",
        "TRAVEL_CHANNEL",
        "FOOD_CHANNEL",
      ])
      .optional(),
    genre: z.array(z.string("Genre is required")).optional(),
    releaseYear: z.number("Release year is required").optional(),
    director: z.string("Director is required").optional(),
    cast: z.array(z.string("Cast is required")).optional(),
    platforms: z.array(z.string("Platforms is required")).optional(),
    posterUrl: z.string().optional(),
    streamingLink: z.string().optional(),
    pricing: z.enum(["FREE", "PREMIUM", "RENTAL"]).optional(),
    isEditorsPick: z.boolean().optional(),
    price: z.number("Price is required").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pricing === "RENTAL" || data.pricing === "PREMIUM") {
      if (data.price === undefined || data.price === null || data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Price is required for RENTAL and PREMIUM content. Must be greater than 0.",
          path: ["price"],
        });
      }
    }
  });

const changePublishStatusValidation = z.object({
  isPublished: z.boolean("isPublished is required"),
});

const changeEditorsPickStatusValidation = z.object({
  isEditorsPick: z.boolean("isEditorsPick is required"),
});

export const MediaValidation = {
  createMediaValidation,
  updateMediaValidation,
  changePublishStatusValidation,
  changeEditorsPickStatusValidation,
};
