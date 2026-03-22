import { prisma } from "../../lib/prisma";

const getStats = async () => {
    const totalMedia = await prisma.media.count();
    const totalReviews = await prisma.review.count({
        where: { status: "APPROVED" }
    });
    const totalEarnings = await prisma.payment.aggregate({
        _sum: { amount: true }
    });
    
    const topReviewedMedia = await prisma.media.findMany({
        orderBy: { reviewCount: "desc" },
        take: 5,
        select: {
            title: true,
            reviewCount: true,
            avgRating: true
        }
    });

    const activeSubscriptions = await prisma.subscription.count({
        where: { status: "ACTIVE" }
    });

    return {
        totalMedia,
        totalReviews,
        totalEarnings: totalEarnings._sum.amount || 0,
        activeSubscriptions,
        topReviewedMedia
    };
};

export const AdminService = {
    getStats
};
