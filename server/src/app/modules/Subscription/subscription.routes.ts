import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/plans", SubscriptionController.getPlans);

router.post("/checkout", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.createCheckoutSession);
router.get("/status", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getSubscriptionStatus);
router.get("/history", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getPaymentHistory);

export const SubscriptionRouter = router;