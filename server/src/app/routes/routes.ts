import { Router } from "express";
import { authRoutes } from "../modules/Auth/auth.routes";
import { ReviewsRoutes } from "../modules/Reviews/reviews.router";
import { MediaRoutes } from "../modules/Media/media.routes";
import { userRoutes } from "../modules/User/user.routes";
import { GenreRoutes } from "../modules/Genre/genre.routes";
import { PaymentRoutes } from "../modules/Payment/payment.routes";
import { ReactionRoutes } from "../modules/Reaction/reaction.route";
import { SubscriptionRouter } from "../modules/Subscription/subscription.routes";
import { WatchlistRouter } from "../modules/Watchlist/watchlist.router";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { PlatformRoutes } from "../modules/Platform/platform.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/media", MediaRoutes);
router.use("/reviews", ReviewsRoutes);
router.use("/genres", GenreRoutes);
router.use("/platforms", PlatformRoutes);
router.use("/payments", PaymentRoutes);
router.use("/reactions", ReactionRoutes);
router.use("/subscriptions", SubscriptionRouter);
router.use("/watchlist", WatchlistRouter);
router.use("/admin", AdminRoutes);

export const AppRoutes = router;
