import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { BookmarkController } from "./bookmark.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.getAllBookmark,
);
router.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.createBookmark,
);
router.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.deleteBookmark,
);

export const BookmarkRouter = router;
    