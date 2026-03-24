import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

import { AuthValidation } from "./auth.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/register",
  // validateRequest(AuthValidation.registerSchema),
  AuthController.register,
);
router.post(
  "/login",
  // validateRequest(AuthValidation.loginSchema),
  AuthController.login,
);
router.get("/logout", checkAuth(Role.USER, Role.ADMIN), AuthController.logout);

router.get("/me", checkAuth(Role.USER, Role.ADMIN), AuthController.getMe);
router.post("/refresh-token", AuthController.getNewToken);

router.post(
  "/change-password",
  checkAuth(Role.USER, Role.ADMIN),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword,
);
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword,
);
router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail,
);

router.post(
  "/send-verify-otp",
  validateRequest(AuthValidation.sendVerifyOtpSchema),
  AuthController.sendVerifyOtp,
);

router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);

export const authRoutes = router;
