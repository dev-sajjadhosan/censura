import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { WatchlistController } from "./watchlist.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.getAllWatchlist,
);
router.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.createWatchlist,
);
router.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.deleteWatchlist,
);

export const WatchlistRouter = router;

// ==> subscription comming soon,...
