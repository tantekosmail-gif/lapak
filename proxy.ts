import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// API yang butuh login DENGAN role ADMIN.
const ADMIN_API_PREFIXES = ["/api/orders"];

// API yang butuh login (role apa pun).
const AUTHENTICATED_API_PREFIXES = [
  "/api/product-categories",
  "/api/public/orders",
];

const matchesPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const isDashboard = (pathname: string) =>
  pathname === "/dashboard" || pathname.startsWith("/dashboard/");

const unauthorized = () =>
  NextResponse.json(
    {
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    },
    { status: 401 },
  );

const forbidden = () =>
  NextResponse.json(
    {
      success: false,
      error: { code: "FORBIDDEN", message: "Admin access required" },
    },
    { status: 403 },
  );

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard adalah area admin: wajib login DAN userType ADMIN.
  if (isDashboard(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Belum login -> arahkan ke halaman signin admin.
    if (!token) {
      const signinUrl = new URL("/admin/signin", request.url);
      signinUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signinUrl);
    }

    // Sudah login tapi CUSTOMER -> tidak boleh akses dashboard.
    if (token.userType !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // API admin-only: wajib login + role ADMIN.
  if (matchesPrefix(pathname, ADMIN_API_PREFIXES)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) return unauthorized();
    if (token.userType !== "ADMIN") return forbidden();

    return NextResponse.next();
  }

  // API yang cukup butuh login.
  if (matchesPrefix(pathname, AUTHENTICATED_API_PREFIXES)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) return unauthorized();

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard", "/dashboard/:path*"],
};
