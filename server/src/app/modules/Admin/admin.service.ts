import { prisma } from "../../lib/prisma";

const getStats = async () => {
  const [
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    revenueAggregate,
    avgRatingAggregate,
  ] = await Promise.all([
    prisma.media.count(),

    prisma.review.count({
      where: { status: "APPROVED" },
    }),

    prisma.user.count(),

    prisma.user.count({
      where: { status: "ACTIVE" },
    }),

    prisma.subscription.count({
      where: { status: "ACTIVE" },
    }),

    prisma.payment.aggregate({
      where: { status: "succeeded" },
      _sum: { amount: true },
    }),

    prisma.review.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true },
    }),
  ]);

  return {
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    totalRevenue: revenueAggregate._sum.amount ?? 0,
    avgRating: avgRatingAggregate._avg.rating ?? 0,
  };
};

const getSales = async () => {
  const [totalSales, revenueAggregate, monthlyRevenue, yearlyRevenue, rawSalesOverTime] =
    await Promise.all([
      prisma.payment.count({
        where: { status: "succeeded" },
      }),

      prisma.payment.aggregate({
        where: { status: "succeeded" },
        _sum: { amount: true },
      }),

      prisma.payment.aggregate({
        where: {
          status: "succeeded",
          subscription: { plan: "MONTHLY" },
        },
        _sum: { amount: true },
      }),

      prisma.payment.aggregate({
        where: {
          status: "succeeded",
          subscription: { plan: "YEARLY" },
        },
        _sum: { amount: true },
      }),

      prisma.payment.findMany({
        where: { status: "succeeded" },
        select: { amount: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

  const totalRevenue = revenueAggregate._sum.amount ?? 0;
  const subscriptionRevenue =
    (monthlyRevenue._sum.amount ?? 0) + (yearlyRevenue._sum.amount ?? 0);

  // Group by date for charts
  const salesOverTime = Object.values(
    rawSalesOverTime.reduce(
      (acc, payment) => {
        const date = payment.createdAt.toISOString().split("T")[0];
        if (!acc[date]) acc[date] = { date, revenue: 0, count: 0 };
        acc[date].revenue += payment.amount;
        acc[date].count += 1;
        return acc;
      },
      {} as Record<string, { date: string; revenue: number; count: number }>,
    ),
  );

  return {
    totalSales,
    totalRevenue,
    purchaseRevenue: 0,       // ready for when MediaPurchase is wired up
    rentalRevenue: 0,         // ready for when MediaPurchase is wired up
    subscriptionRevenue,
    salesOverTime,
  };
};

const getReviews = async () => {
  const [reviewsData, recentReviews] = await Promise.all([
    prisma.review.groupBy({
      by: ["rating"],
      _count: { id: true },
      orderBy: { rating: "asc" },
    }),

    prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        content: true,
        status: true,
        user: {
          select: { name: true },
        },
        media: {
          select: { title: true },
        },
      },
    }),
  ]);

  return {
    byRating: reviewsData,  // [{rating, _count: {id}}]
    recentReviews,          // matches frontend review list exactly
  };
};

const getAllMedia = async ({ limit = 10, sortBy = "avgRating", sortOrder = "desc" }: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const media = await prisma.media.findMany({
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      title: true,
      type: true,
      releaseYear: true,
      avgRating: true,
      reviewCount: true,
    },
  });

  return media;
};

export const AdminService = {
  getStats,
  getSales,
  getReviews,
  getAllMedia,
};