import { verifyToken } from "./utils/jwt-utils";
import {
  getDefaultRoute,
  getRouteOwner,
  isAuthRoute,
  Role,
} from "./utils/auth-client";
import { isTokenExpiredSoon } from "./utils/token-utils";
import { NextRequest, NextResponse } from "next/server";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshTokens(refreshToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function getCurrentUser(accessToken: string, sessionToken?: string) {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}${sessionToken ? `; better-auth.session_token=${sessionToken}` : ""}`,
      },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const sessionToken = request.cookies.get(
      "better-auth.session_token",
    )?.value;

    // // 🔍 LOG 1: Cookies + env vars
    // console.log("[MW] PATH:", pathname);
    // console.log(
    //   "[MW] accessToken:",
    //   accessToken ? accessToken.slice(0, 30) + "..." : "MISSING ⚠️",
    // );
    // console.log("[MW] refreshToken:", refreshToken ? "EXISTS" : "MISSING");
    // console.log("[MW] BASE_API_URL:", BASE_API_URL ?? "MISSING ⚠️");
    // console.log(
    //   "[MW] JWT_ACCESS_SECRET:",
    //   process.env.JWT_ACCESS_SECRET ? "SET" : "MISSING ⚠️",
    // );

    const verified = accessToken
      ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      : null;

    // 🔍 LOG 2: Token verification
    // console.log(
    //   "[MW] verified:",
    //   verified?.success ?? false,
    //   "| role:",
    //   verified?.data?.role ?? "none",
    // );

    const isValidAccessToken = verified?.success ?? false;
    const decodedAccessToken = verified?.data;
    const userRole = decodedAccessToken?.role as Role | null;

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // 🔍 LOG 3: Route classification
    // console.log("[MW] routeOwner:", routeOwner, "| isAuth:", isAuth);

    // Proactively refresh token if expiring soon
    if (
      isValidAccessToken &&
      refreshToken &&
      (await isTokenExpiredSoon(accessToken!))
    ) {
      // console.log("[MW] Token expiring soon, refreshing...");
      await refreshTokens(refreshToken);
      return NextResponse.next();
    }

    // Rule 1: Logged in + auth route -> redirect to dashboard
    if (isAuth && isValidAccessToken) {
      // console.log("[MW] Rule 1 hit: redirecting to dashboard");
      return NextResponse.redirect(
        new URL(getDefaultRoute(userRole as Role), request.url),
      );
    }

    // Rule 2: Reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      if (accessToken && email) {
        const userInfo = await getCurrentUser(accessToken, sessionToken);
        // console.log("[MW] Rule 2 - getCurrentUser:", userInfo ?? "NULL ⚠️");
        if (userInfo?.needPasswordChange) return NextResponse.next();
        return NextResponse.redirect(
          new URL(getDefaultRoute(userRole as Role), request.url),
        );
      }
      if (email) return NextResponse.next();
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 3: Public route -> allow
    if (routeOwner === null) {
      // console.log("[MW] Rule 3 hit: public route, allowing");
      return NextResponse.next();
    }

    // Rule 4: Not logged in + protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      // console.log(
      //   "[MW] Rule 4 hit: no valid token, redirecting to login | accessToken:",
      //   !!accessToken,
      //   "| isValidAccessToken:",
      //   isValidAccessToken,
      // );
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 5: Email verification + password change enforcement
    if (accessToken) {
      const userInfo = await getCurrentUser(accessToken, sessionToken);

      // 🔍 LOG 4: /auth/me result
      console.log(
        "[MW] Rule 5 - getCurrentUser:",
        userInfo
          ? JSON.stringify(userInfo)
          : "NULL ⚠️ (API unreachable or non-ok)",
      );

      if (userInfo) {
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            // console.log("[MW] Rule 5: email not verified, redirecting");
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
            // console.log("[MW] Rule 5: needs password change, redirecting");
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

    // Rule 6: Common protected route -> allow
    if (routeOwner === "COMMON") {
      // console.log("[MW] Rule 6 hit: common protected route, allowing");
      return NextResponse.next();
    }

    // Rule 7: Role-based protection
    if (routeOwner === "ADMIN" && userRole !== "ADMIN") {
      // console.log("[MW] Rule 7 hit: not admin, redirecting");
      return NextResponse.redirect(
        new URL(getDefaultRoute(userRole as Role), request.url),
      );
    }

    if (routeOwner === "USER" && userRole !== "USER") {
      // console.log("[MW] Rule 7 hit: not user, redirecting");
      return NextResponse.redirect(
        new URL(getDefaultRoute(userRole as Role), request.url),
      );
    }

    // console.log("[MW] Final: allowing through");
    return NextResponse.next();
  } catch (error) {
    console.error("[MW] Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
