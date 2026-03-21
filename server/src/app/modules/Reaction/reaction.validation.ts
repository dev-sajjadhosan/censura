import { z } from "zod";

const createLikeValidation = z.object({
    body: z.object({
        reviewId: z.string("Review ID is required"),
        reaction: z.enum(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]),
    }),
});

const deleteLikeValidation = z.object({
    body: z.object({
        reviewId: z.string("Review ID is required"),
        reaction: z.enum(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]),
    }),
});

export const ReactionValidation = {
    createLikeValidation,
    deleteLikeValidation,
};