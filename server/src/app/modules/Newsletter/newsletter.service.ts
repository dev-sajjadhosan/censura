import { envVars } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/email";

const subscribeToNewsletter = async (email: string) => {
    const existing = await prisma.newsletter.findUnique({
        where: { email },
    });

    if (existing) {
        return { message: "Already subscribed", success: true }; 
    }

    const subscriber = await prisma.newsletter.create({
        data: { email },
    });
    await sendEmail({
        to: email,
        subject: "Welcome to Censura - You're in! 🍿",
        templateName: "newsletter-welcome",
        templateData: {
            website_url: envVars.FRONTEND_URL || "http://localhost:3000",
            email: email
        },
    });

    return subscriber;
};

export const NewsletterService = {
    subscribeToNewsletter,
};