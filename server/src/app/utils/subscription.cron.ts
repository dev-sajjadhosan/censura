import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { SubStatus } from "../../generated/prisma/enums";
import { sendEmail } from "../utils/email";
import { envVars } from "../config/env";

export const startSubscriptionCronJobs = () => {
    // Run every day at midnight
    // cron string: "0 0 * * *"
    cron.schedule("0 0 * * *", async () => {
        console.log("Running daily subscription check cron job...");

        try {
            const today = new Date();
            const activeSubscriptions = await prisma.subscription.findMany({
                where: { status: SubStatus.ACTIVE },
                include: { user: true }
            });

            for (const sub of activeSubscriptions) {
                if (!sub.endDate || !sub.user) continue;

                const startTimestamp = sub.startDate.getTime();
                const endTimestamp = sub.endDate.getTime();
                const halfwayTimestamp = startTimestamp + (endTimestamp - startTimestamp) / 2;
                
                const halfwayDate = new Date(halfwayTimestamp);
                
                // 1. Check Halfway Point
                if (
                    halfwayDate.getFullYear() === today.getFullYear() &&
                    halfwayDate.getMonth() === today.getMonth() &&
                    halfwayDate.getDate() === today.getDate()
                ) {
                    await sendEmail({
                        to: sub.user.email,
                        subject: "You're halfway through your premium plan!",
                        templateName: "subscription-halfway",
                        templateData: {
                            userName: sub.user.name,
                            plan: sub.plan,
                            endDate: sub.endDate.toLocaleDateString(),
                            loginUrl: `${envVars.FRONTEND_URL}/login`
                        }
                    });
                    console.log(`Halfway email sent to ${sub.user.email}`);
                }

                // 2. Check Expiration
                if (sub.endDate < today) {
                    // Force update status in Database to EXPIRED
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: { status: SubStatus.EXPIRED }
                    });

                    // Send expiration email
                    await sendEmail({
                        to: sub.user.email,
                        subject: "Your Censura Subscription has Expired",
                        templateName: "subscription-expired",
                        templateData: {
                            userName: sub.user.name,
                            plan: sub.plan,
                            endDate: sub.endDate.toLocaleDateString(),
                            loginUrl: `${envVars.FRONTEND_URL}/dashboard` // Or pricing page
                        }
                    });
                    console.log(`Expiration email sent to ${sub.user.email}`);
                }
            }
        } catch (error) {
            console.error("Error running subscription cron job", error);
        }
    });

    console.log("Subscription cron jobs initialized.");
};
