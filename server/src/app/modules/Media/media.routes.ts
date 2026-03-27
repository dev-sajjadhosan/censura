import { Router } from "express";
import { MediaController } from "./media.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { MediaValidation } from "./media.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.createMediaValidation),
  MediaController.createMedia,
);
router.get("/", MediaController.getAllMedia); // Public
router.get("/:id", MediaController.getSingleMedia); // Public
router.get("/slug/:slug", MediaController.getMediaBySlug); // Public
router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.updateMediaValidation),
  MediaController.updateMedia,
);
router.delete("/:id", checkAuth(Role.ADMIN), MediaController.deleteMedia);
router.patch(
  "/featured/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.changeFeaturedStatusValidation),
  MediaController.changeFeaturedStatus,
);
router.patch(
  "/publish/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.changePublishStatusValidation),
  MediaController.changePublishStatus,
);

export const MediaRoutes = router;
