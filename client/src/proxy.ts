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
    if (!refresh) {
      return false;
    }
    return true;
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
    const decodedAccessToken =
      accessToken &&
      verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

    const isValidAccessToken =
      accessToken &&
      verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

    let userRole: Role | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as Role;
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Proactively refresh token if refresh token exists and access token is expired or about to expire
    if (
      isValidAccessToken &&
      refreshToken &&
      (await isTokenExpiredSoon(accessToken))
    ) {
      const requestHeaders = new Headers(request.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }

      return response;
    }

    // Rule-1: User is logged in and trying to access auth route -> redirect to default route
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(
        new URL(getDefaultRoute(userRole as Role), request.url),
      );
    }

    // Rule-2: User is trying to access reset password page
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

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-3: Public route -> allow
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // Rule-4: Not logged in but trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-5: Enforce email verification and password change flows
    if (accessToken) {
      const userInfo = await getCurrentUser();

      if (userInfo) {
        // Email not verified
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }
          return NextResponse.next();
        }

        // Email verified but still on verify-email page
        if (userInfo.emailVerified && pathname === "/verify-email") {
          return NextResponse.redirect(
            new URL(getDefaultRoute(userRole as Role), request.url),
          );
        }

        // Needs password change
        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }
          return NextResponse.next();
        }

        // Password change done but still on reset-password page
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

    // Rule-7: Role-based protected route, wrong role -> redirect to their default route
    if (routerOwner === "ADMIN") {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultRoute(userRole as Role), request.url),
        );
      }
    }

    return NextResponse.next({
      request: {
        headers: headers,
      },
    });
  } catch (error) {
    console.error("Error in proxy middleware:", error);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};