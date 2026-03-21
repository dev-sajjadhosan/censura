import { Router } from "express";
import { authRoutes } from "../modules/Auth/auth.routes";
import { ReviewsRoutes } from "../modules/Reviews/reviews.router";
import { MediaRoutes } from "../modules/Media/media.routes";
import { userRoutes } from "../modules/User/user.routes";
import { GenreRoutes } from "../modules/Genre/genre.routes";
import { PaymentRoutes } from "../modules/Payment/payment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/media", MediaRoutes);
router.use("/reviews", ReviewsRoutes);
router.use("/genres", GenreRoutes);
router.use("/payments", PaymentRoutes);

export const AppRoutes = router;
