import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_API_PREFIXES = ["/api/product-categories"];

const isProtectedPath = (pathname: string) =>
  PROTECTED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const unauthorized = () =>
  NextResponse.json(
    {
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    },
    { status: 401 },
  );

export async function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
