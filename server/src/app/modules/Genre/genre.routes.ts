import { Router } from "express";
import { GenreController } from "./genre.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { GenreValidation } from "./genre.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.createGenreSchema),
  GenreController.createGenre,
);

router.get("/", GenreController.getAllGenres);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.updateGenreSchema),
  GenreController.updateGenre,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  GenreController.deleteGenre,
);

export const GenreRoutes = router;
