import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUser,
  getNewTokensWithRefreshToken,
} from "./services/user.service";
import { verifyToken } from "./utils/jwt-utils";
import {
  getDefaultRoute,
  getRouteOwner,
  isAuthRoute,
  Role,
} from "./utils/auth-client";
import { isTokenExpiredSoon } from "./utils/token-utils";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken);
    return !!refresh;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const search = url.search;

    const headers = new Headers(request.headers);
    headers.set("x-url", request.url);
    headers.set("x-origin", origin);
    headers.set("x-pathname", pathname);
    headers.set("x-search", search);

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Fix-5: verify token once
    const tokenResult = accessToken
      ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      : null;
    const isValidAccessToken = tokenResult?.success ?? false;
    const decodedAccessToken = tokenResult?.data ?? null;

    let userRole: Role | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as Role;
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Fix-1: refresh if token invalid OR expiring soon
    if (
      refreshToken &&
      (!isValidAccessToken ||
        (accessToken && (await isTokenExpiredSoon(accessToken))))
    ) {
      const requestHeaders = new Headers(request.headers);
      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // Rule-1: Logged in + auth route -> redirect to default
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(
        new URL(getDefaultRoute(userRole as Role), request.url),
      );
    }

    // Rule-2: Reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");

      if (accessToken && email) {
        const userInfo = await getCurrentUser();
        if (userInfo?.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(getDefaultRoute(userRole as Role), request.url),
          );
        }
      }

      if (email) return NextResponse.next();

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-3: Public route -> allow
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // Rule-4: Not logged in + protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-5: Email verification + password change enforcement
    if (accessToken) {
      const userInfo = await getCurrentUser();

      if (userInfo) {
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }
          return NextResponse.next();
        }

        if (userInfo.emailVerified && pathname === "/verify-email") {
          return NextResponse.redirect(
            new URL(getDefaultRoute(userRole as Role), request.url),
          );
        }

        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }
          return NextResponse.next();
        }

        if (!userInfo.needPasswordChange && pathname === "/reset-password") {
          return NextResponse.redirect(
            new URL(getDefaultRoute(userRole as Role), request.url),
          );
        }
      }
    }

    // Rule-6: Common protected route -> allow
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    // Fix-4: Role-based route, wrong role -> redirect
    if (routerOwner === "ADMIN" || routerOwner === "USER") {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultRoute(userRole as Role), request.url),
        );
      }
    }

    return NextResponse.next({
      request: { headers },
    });
  } catch (error) {
    // Fix-3: always return a response
    console.error("Error in proxy middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
