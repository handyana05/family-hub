import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico");

  if (isStatic) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const hasSession = Boolean(request.cookies.get("familyhub_session")?.value);

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
