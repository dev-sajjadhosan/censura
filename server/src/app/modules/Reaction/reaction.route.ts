import { Router } from "express";
import { ReactionController } from "./reaction.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { ReactionValidation } from "./reaction.validation";

const router = Router();

router.get("/comment", ReactionController.getAllComments); // public
router.get("/comment/:reviewId", ReactionController.getCommentsByReviewId); // public
router.get(
  "/admin/comments",
  checkAuth(Role.ADMIN),
  ReactionController.adminGetAllComments,
);

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

router.post(
  "/comment",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.createCommentValidation),
  ReactionController.createComment,
);
router.delete(
  "/comment/:id",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.deleteCommentValidation),
  ReactionController.deleteComment,
);

router.post(
  "/comment/reply",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.createCommentReplyValidation),
  ReactionController.createCommentReply,
);
router.put(
  "/comment/:id",
  checkAuth(Role.USER),
  validateRequest(ReactionValidation.updateCommentValidation),
  ReactionController.updateComment,
);

router.patch(
  "/admin/comment/status/:id",
  checkAuth(Role.ADMIN),
  ReactionController.adminStausComment,
);

router.delete(
  "/admin/comment/:id",
  checkAuth(Role.ADMIN),
  ReactionController.adminDeleteComment,
);

export const ReactionRoutes = router;
