import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/stats", checkAuth(Role.ADMIN), AdminController.getStats);

export const AdminRoutes = router;
