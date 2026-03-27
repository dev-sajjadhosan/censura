import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/my-payments",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyPayments,
);

router.get(
  "/all-payments",
  checkAuth(Role.ADMIN),
  PaymentController.getAllPayments,
);

router.get(
  "/my-media-purchases",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyMediaPurchases,
);

router.post(
  "/purchase-media",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.createMediaPurchase,
);

export const PaymentRoutes = router;
