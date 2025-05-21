import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware ejecutado");

  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization") ||
    request.nextUrl.searchParams.get("token");


  if (request.nextUrl.pathname === "/main" && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|login).*)"],
};
