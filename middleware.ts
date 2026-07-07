import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE_NAME = "bridge_access";
const PUBLIC_FILE_PATTERN = /\.[^/]+$/;

function isPublicPath(pathname: string) {
  return (
    pathname === "/enter" ||
    pathname === "/api/enter" ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/robots.txt" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/icons/") ||
    PUBLIC_FILE_PATTERN.test(pathname)
  );
}

function withNoIndexHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return withNoIndexHeaders(NextResponse.next());
  }

  if (request.cookies.has(ACCESS_COOKIE_NAME)) {
    return withNoIndexHeaders(NextResponse.next());
  }

  const enterUrl = request.nextUrl.clone();
  enterUrl.pathname = "/enter";
  enterUrl.searchParams.set("from", `${pathname}${request.nextUrl.search}`);

  return withNoIndexHeaders(NextResponse.redirect(enterUrl));
}

export const config = {
  matcher: ["/:path*"]
};
