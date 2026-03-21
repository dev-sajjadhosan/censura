import { Router } from "express";
import { ReactionController } from "./reaction.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { ReactionValidation } from "./reaction.validation";


const router = Router();

router.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.createLikeValidation),
  ReactionController.createLike,
);
router.delete(
  "/:id",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.deleteLikeValidation),
  ReactionController.deleteLike,
);

export const ReactionRoutes = router;
