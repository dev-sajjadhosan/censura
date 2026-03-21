import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { AuthGuard } from "../../middleware/authGuard";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/my-history",
  AuthGuard(Role.USER, Role.ADMIN),
  PaymentController.getMyPayments,
);

router.get(
  "/",
  AuthGuard(Role.ADMIN),
  PaymentController.getAllPayments,
);

export const PaymentRoutes = router;
