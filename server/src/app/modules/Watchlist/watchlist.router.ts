import { Router } from "express";
import { WatchlistController } from "./watchlist.controller";

const router = Router();

router.get("/", WatchlistController.getAllWatchlist);
router.post("/", WatchlistController.createWatchlist);
router.delete("/:id", WatchlistController.deleteWatchlist);

export const WatchlistRouter = router;

// ==> subscription comming soon,...