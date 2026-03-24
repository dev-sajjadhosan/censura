import { NextFunction, Request, Response } from "express";

import AppError from "../error-helpers/AppError";
import status from "http-status";
import { envVars } from "../config/env";

import { Role, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Session Token Verification
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No session token provided.",
        );
      }

      if (sessionToken) {
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;
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

            console.log("Session Expring Soon!");
          }
          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User not active.",
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User not active.",
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role as Role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource.",
            );
          }


          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
            status: user.status as UserStatus,
            isDeleted: user.isDeleted,
            emailVerified: user.emailVerified,
          };
        }

        // Access Token Verification
        const accessToken = CookieUtils.getCookie(req, "accessToken");

        if (!accessToken) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorize access! No access token provided.",
          );
        }
      }

      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No access token provided.",
        );
      }

      const verifyToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifyToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token.",
        );
      }

      // console.log(verifyToken.data!.role);

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifyToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      next(); // Go to the next road...
    } catch (error: any) {
      next(error);
    }
  };
};
