// middleware.ts
import { auth } from "@/lib/auth";

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolios/:path*",
  ],
};
