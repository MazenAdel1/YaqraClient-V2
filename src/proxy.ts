import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const PROTECTED_PATH_PREFIXES = ["/feed", "/profile", "/book-finder"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isProtectedPath = PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!token && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/feed/:path*",
    "/profile/:path*",
    "/book-finder/:path*",
  ],
};
