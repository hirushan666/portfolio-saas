// middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // Portfolio view pages (/portfolios/[id]) should be public
  // But /portfolios/new and /portfolios/[id]/edit should be protected
  const isPublicPortfolioView =
    pathname.startsWith("/portfolios/") &&
    !pathname.endsWith("/new") &&
    !pathname.endsWith("/edit");

  const isProtected =
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/portfolios") && !isPublicPortfolioView);

  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/portfolios/:path*"],
};
