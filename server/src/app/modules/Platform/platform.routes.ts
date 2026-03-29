import { Router } from "express";
import { PlatformController } from "./platform.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { PlatformValidation } from "./platform.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(PlatformValidation.createPlatformSchema),
  PlatformController.createPlatform,
);

router.get("/", PlatformController.getAllPlatforms);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(PlatformValidation.updatePlatformSchema),
  PlatformController.updatePlatform,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  PlatformController.deletePlatform,
);

export const PlatformRoutes = router;
