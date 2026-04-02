import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";

import status from "http-status";
import AppError from "../error-helpers/AppError";
import { prisma } from "../lib/prisma";

import { envVars } from "../config/env";
import { getCookie } from "../utils/cookie";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Check session token
      const sessionToken = getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new AppError(status.UNAUTHORIZED, "No session token provided.");
      }

      const sessionExist = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      // 2. Session must exist
      if (!sessionExist || !sessionExist.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid or expired session.");
      }

      const user = sessionExist.user;

      // 3. User must be active
      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.DELETED ||
        user.isDeleted
      ) {
        throw new AppError(status.UNAUTHORIZED, "User account is not active.");
      }

      // 4. Email must be verified
      if (!user.emailVerified) {
        throw new AppError(status.UNAUTHORIZED, "Email not verified.");
      }
      if (user.emailVerified && user.status === UserStatus.UNVERIFIED) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: UserStatus.ACTIVE,
          },
        });
      }

      // 5. Session expiry warning
      const now = new Date();
      const expiresAt = new Date(sessionExist.expiresAt);
      const createdAt = new Date(sessionExist.createdAt);
      const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
      const timeRemaining = expiresAt.getTime() - now.getTime();
      const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

      if (percentRemaining < 20) {
        res.setHeader("X-Session-Refresh", "true");
        res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
        res.setHeader("X-Time-Remaining", timeRemaining.toString());
      }

      // 6. Check access token
      const accessToken = getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "No access token provided.");
      }

      const verifyTokenResult = verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );
      if (!verifyTokenResult.success) {
        throw new AppError(status.UNAUTHORIZED, "Invalid access token.");
      }

      // 7. Role check
      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifyTokenResult.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "You do not have permission to access this resource.",
        );
      }

      // 8. Attach user to request
      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        status: user.status as UserStatus,
        isDeleted: user.isDeleted,
        emailVerified: user.emailVerified,
      };

      next();
    } catch (error: any) {
      next(error);
    }
  };
};
