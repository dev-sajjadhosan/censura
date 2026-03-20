import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/", checkAuth(Role.ADMIN), UserController.getAllUsers) 
router.get("/:id", checkAuth(Role.ADMIN), UserController.getUserById) 
router.patch("/profile", checkAuth(Role.USER), UserController.updateProfile) 
router.delete("/:id", checkAuth(Role.ADMIN), UserController.deleteUser) 
router.patch("/:id/status", checkAuth(Role.ADMIN), UserController.changeStatus) 

export const userRoutes = router 