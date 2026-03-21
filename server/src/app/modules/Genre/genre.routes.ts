import { Router } from "express";
import { GenreController } from "./genre.controller";
import validateRequest from "../../middleware/validateRequest";
import { GenreValidation } from "./genre.validation";
import { AuthGuard } from "../../middleware/authGuard";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  AuthGuard(Role.ADMIN),
  validateRequest(GenreValidation.createGenreSchema),
  GenreController.createGenre,
);

router.get("/", GenreController.getAllGenres);

router.delete(
  "/:id",
  AuthGuard(Role.ADMIN),
  GenreController.deleteGenre,
);

export const GenreRoutes = router;
