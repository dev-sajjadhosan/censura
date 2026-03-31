import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewsValidation } from "./reviews.validation";

const router = Router();

router.get("/", ReviewsController.getAllReview); // Public
router.get("/admin", checkAuth(Role.ADMIN), ReviewsController.getAllReviewAdmin); // Public
router.get("/media/:mediaId", ReviewsController.getReviewByMediaId); // Public
router.get("/:id", ReviewsController.getSingleReview); // Public
router.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(ReviewsValidation.createReviewValidation),
  ReviewsController.createReview,
);
router.patch(
  "/:id",
  checkAuth(Role.USER),
  validateRequest(ReviewsValidation.updateReviewValidation),
  ReviewsController.updateReview,
);
router.delete(
  "/:id",
  checkAuth(Role.USER),
  ReviewsController.deleteReview,
);
router.patch(
  "/admin/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(ReviewsValidation.updateReviewStatusValidation),
  ReviewsController.updateReviewStatus,
);
router.delete(
  "/admin/delete/:id",
  checkAuth(Role.ADMIN),
  ReviewsController.deleteReviewByAdmin,
);

export const ReviewsRoutes = router;
