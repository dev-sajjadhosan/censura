import { Router } from "express";
import { MediaRoutes } from "../modules/Media/media.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { ReviewsRoutes } from "../modules/Reviews/reviews.router";
import { userRoutes } from "../modules/User/user.routes";
import { GenreRoutes } from "../modules/Genre/genre.routes";
import { PaymentRoutes } from "../modules/Payment/payment.routes";
import { ReactionRoutes } from "../modules/Reaction/reaction.route";
import { SubscriptionRouter } from "../modules/Subscription/subscription.routes";
import { WatchlistRouter } from "../modules/Watchlist/watchlist.router";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { PlatformRoutes } from "../modules/Platform/platform.routes";
import { BookmarkRouter } from "../modules/Bookmark/bookmark.routes";
import { FavoriteRouter } from "../modules/Favourite/favourite.routes";
import { NewsletterRoutes } from "../modules/Newsletter/newsletter.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/media", MediaRoutes);
router.use("/users", userRoutes);
router.use("/reviews", ReviewsRoutes);
router.use("/genres", GenreRoutes);
router.use("/platforms", PlatformRoutes);
router.use("/payments", PaymentRoutes);
router.use("/reactions", ReactionRoutes);
router.use("/subscriptions", SubscriptionRouter);
router.use("/watchlist", WatchlistRouter);
router.use("/bookmarks", BookmarkRouter);
router.use("/favorites", FavoriteRouter);
router.use("/admin", AdminRoutes);
router.use("/newsletter", NewsletterRoutes);

export const AppRoutes = router;
