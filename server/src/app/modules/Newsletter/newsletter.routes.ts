import { Router } from "express";
import { NewsletterController } from "./newsletter.controller";

import { NewsletterValidation } from "./newsletter.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/subscribe",
  validateRequest(NewsletterValidation.subscribeToNewsletter),
  NewsletterController.subscribeToNewsletter,
);

export const NewsletterRoutes = router;
