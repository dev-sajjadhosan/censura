import { Router } from "express";
import { authRoutes } from "../modules/Auth/auth.routes";

const router = Router()

router.use("/auth", authRoutes)

export const AppRoutes = router