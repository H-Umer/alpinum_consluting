import { NextResponse } from "next/server";

const publicPaths = [
  "/auth/sign-up",
  "/auth",
  "/auth/verify-code",
  "/_next",
  "/public",
  "/favicon.svg",
  "/images",
  "/401",
  "/auth/reset-password",
  "/auth/forget-password",
  "/fonts/icomoon.ttf",
  "/public/fonts",
  "/contractors",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const path = publicPaths.some((path) => pathname.includes(path));
  const authTokenLogin = request.cookies.get("token");
  const role = request.cookies.get("role")?.value;

  if (pathname === "/" && authTokenLogin) {
    if (role === "CONTRACTOR") {
      return NextResponse.redirect(
        new URL("/contractor/dashboard", request.url)
      );
    }
    if (role === "COMPANY") {
      return NextResponse.redirect(new URL("/company/dashboard", request.url));
    }
  }

  if (authTokenLogin && pathname.startsWith("/auth" || "/contractors")) {
    if (role === "CONTRACTOR")
      return NextResponse.redirect(
        new URL("/contractor/dashboard", request.url)
      );
    if (role === "COMPANY")
      return NextResponse.redirect(new URL("/company/dashboard", request.url));
  }

  if (!path && !authTokenLogin) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (authTokenLogin) {
    if (
      (pathname.startsWith("/contractor") ||
        pathname.startsWith("/contractors")) &&
      role === "COMPANY"
    ) {
      return NextResponse.redirect(new URL("/company/dashboard", request.url));
    }
    if (
      (pathname.startsWith("/company") ||
        pathname.startsWith("/contractors")) &&
      role === "CONTRACTOR"
    ) {
      return NextResponse.redirect(
        new URL("/contractor/dashboard", request.url)
      );
    }
  }

  if (path) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
