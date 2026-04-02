import z from "zod";

export const NewsletterValidation = {
    subscribeToNewsletter: z.object({
        email: z.email("Please provide a valid email address"),
    }),
}