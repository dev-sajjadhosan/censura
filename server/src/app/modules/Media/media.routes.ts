import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { MediaValidation } from "./media.validation";
import { createManyMedia, createMedia, deleteMedia, updateMedia, getAllMedia, getSingleMedia, getMediaBySlug, changeFeaturedStatus, changePublishStatus } from "./media.controller";

const router = Router();
router.post("/bulk", checkAuth(Role.ADMIN), createManyMedia); 

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.createMediaValidationSchema),
  createMedia,
);
router.get("/", getAllMedia); // Public
router.get("/:id", getSingleMedia); // Public
router.get("/slug/:slug", getMediaBySlug); // Public
router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.updateMediaValidation),
  updateMedia,
);
router.delete("/:id", checkAuth(Role.ADMIN), deleteMedia);
router.patch(
  "/featured/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.changeFeaturedStatusValidation),
  changeFeaturedStatus,
);
router.patch(
  "/publish/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.changePublishStatusValidation),
  changePublishStatus,
);

export const MediaRoutes = router;
