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
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // 1. Initial Token Verification
    const tokenResult = accessToken
      ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      : null;

    let isValidAccessToken = !!tokenResult?.success;
    let userRole = (tokenResult?.data?.role as Role) || null;

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // 2. Token Refresh Logic
    if (
      refreshToken &&
      (!isValidAccessToken ||
        (accessToken && (await isTokenExpiredSoon(accessToken))))
    ) {
      const refreshed = await refreshTokenMiddleware(refreshToken);

      if (refreshed) {
        const response = NextResponse.redirect(request.url);
        response.headers.set("x-token-refreshed", "1");
        return response;
      }

      // --- NEW: If Refresh Fails, Cleanup Invalid Cookies ---
      isValidAccessToken = false;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    // 3. Public Route Exception
    if (!isAuth && routerOwner === null) {
      return NextResponse.next();
    }

    // 4. Auth Route Logic (Login/Register)
    if (isAuth) {
      if (isValidAccessToken) {
        return NextResponse.redirect(
          new URL(getDefaultRoute(userRole!), request.url),
        );
      }
      return NextResponse.next();
    }

    // 5. PROTECTED ROUTE ENFORCEMENT
    if (!isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);

      // Cleanup cookies if they exist but are invalid
      if (accessToken) response.cookies.delete("accessToken");
      if (refreshToken) response.cookies.delete("refreshToken");

      return response;
    }

    // 6. Identity Enforcement (Email/Password status)
    const userInfo = await getCurrentUser();
    if (userInfo) {
      if (!userInfo.emailVerified && pathname !== "/verify-email") {
        const verifyUrl = new URL("/verify-email", request.url);
        verifyUrl.searchParams.set("email", userInfo.email);
        return NextResponse.redirect(verifyUrl);
      }
      if (userInfo.needPasswordChange && pathname !== "/reset-password") {
        const resetUrl = new URL("/reset-password", request.url);
        resetUrl.searchParams.set("email", userInfo.email);
        return NextResponse.redirect(resetUrl);
      }
      if (userInfo.emailVerified && pathname === "/verify-email") {
        return NextResponse.redirect(
          new URL(getDefaultRoute(userRole!), request.url),
        );
      }
    }

    // 7. Role-Based Access Control
    if (routerOwner === "ADMIN" || routerOwner === "USER") {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultRoute(userRole!), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
