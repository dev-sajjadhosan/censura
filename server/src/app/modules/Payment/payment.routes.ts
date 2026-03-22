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
  "/",
  checkAuth(Role.ADMIN),
  PaymentController.getAllPayments,
);

export const PaymentRoutes = router;
