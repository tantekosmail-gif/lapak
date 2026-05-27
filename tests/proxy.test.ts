import "@/tests/mocks/prisma";
import "@/tests/mocks/google-auth";

import { NextRequest } from "next/server";
import { signedInAs, signedOut, getTokenMock } from "@/tests/mocks/google-auth";
import { proxy, config } from "@/proxy";

const buildRequest = (pathname: string, init?: RequestInit | any) =>
  new NextRequest(`http://localhost:3000${pathname}`, init);

describe("proxy (API auth gate for app/api/(auth)/**)", () => {
  describe("matcher config", () => {
    it("runs the proxy on /api/* and /dashboard paths", () => {
      expect(config.matcher).toEqual([
        "/api/:path*",
        "/dashboard",
        "/dashboard/:path*",
      ]);
    });
  });

  describe("protected route: /api/product-categories", () => {
    it("lets an authenticated request through with NextResponse.next()", async () => {
      signedInAs();

      const response = await proxy(buildRequest("/api/product-categories"));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(getTokenMock).toHaveBeenCalledTimes(1);
    });

    it("returns 401 with UNAUTHORIZED payload when the request is unauthenticated", async () => {
      signedOut();

      const response = await proxy(buildRequest("/api/product-categories"));

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
    });

    it("also protects nested paths like /api/product-categories/123", async () => {
      signedOut();

      const response = await proxy(buildRequest("/api/product-categories/123"));

      expect(response.status).toBe(401);
    });

    it("does not protect lookalike paths like /api/product-categories-other", async () => {
      signedOut();

      const response = await proxy(
        buildRequest("/api/product-categories-other"),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(getTokenMock).not.toHaveBeenCalled();
    });
  });

  describe("dashboard guard: /dashboard (admin-only)", () => {
    it("lets an ADMIN through with NextResponse.next()", async () => {
      signedInAs({ user: { userType: "ADMIN" } as never });

      const response = await proxy(buildRequest("/dashboard"));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("redirects a signed-in CUSTOMER to the store home", async () => {
      signedInAs({ user: { userType: "CUSTOMER" } as never });

      const response = await proxy(buildRequest("/dashboard"));

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/");
    });

    it("blocks CUSTOMER from nested dashboard paths too", async () => {
      signedInAs({ user: { userType: "CUSTOMER" } as never });

      const response = await proxy(buildRequest("/dashboard/produk"));

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/");
    });

    it("redirects an unauthenticated visitor to /admin/signin with callbackUrl", async () => {
      signedOut();

      const response = await proxy(buildRequest("/dashboard/pesanan"));

      expect(response.status).toBe(307);
      const location = new URL(response.headers.get("location")!);
      expect(location.pathname).toBe("/admin/signin");
      expect(location.searchParams.get("callbackUrl")).toBe(
        "/dashboard/pesanan",
      );
    });
  });

  describe("admin-only API: /api/orders", () => {
    it("returns 401 when unauthenticated", async () => {
      signedOut();

      const response = await proxy(buildRequest("/api/orders", { method: "POST" }));

      expect(response.status).toBe(401);
    });

    it("returns 403 when a CUSTOMER tries to hit it", async () => {
      signedInAs({ user: { userType: "CUSTOMER" } as never });

      const response = await proxy(buildRequest("/api/orders", { method: "POST" }));

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.error.code).toBe("FORBIDDEN");
    });

    it("lets an ADMIN through", async () => {
      signedInAs({ user: { userType: "ADMIN" } as never });

      const response = await proxy(buildRequest("/api/orders", { method: "POST" }));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("guards nested admin actions like /api/orders/5/approve too", async () => {
      signedInAs({ user: { userType: "CUSTOMER" } as never });

      const response = await proxy(
        buildRequest("/api/orders/5/approve", { method: "PATCH" }),
      );

      expect(response.status).toBe(403);
    });
  });

  describe("authenticated API: /api/public/orders", () => {
    it("returns 401 when unauthenticated", async () => {
      signedOut();

      const response = await proxy(
        buildRequest("/api/public/orders", { method: "POST" }),
      );

      expect(response.status).toBe(401);
    });

    it("lets a signed-in CUSTOMER through (not admin-gated)", async () => {
      signedInAs({ user: { userType: "CUSTOMER" } as never });

      const response = await proxy(
        buildRequest("/api/public/orders", { method: "POST" }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("also guards nested paths like /api/public/orders/5/request-cancel", async () => {
      signedOut();

      const response = await proxy(
        buildRequest("/api/public/orders/5/request-cancel", { method: "PUT" }),
      );

      expect(response.status).toBe(401);
    });
  });

  describe("non-protected API routes", () => {
    it("does not require a session for /api/auth/* (NextAuth)", async () => {
      signedOut();

      const response = await proxy(
        buildRequest("/api/auth/callback/google", { method: "POST" }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(getTokenMock).not.toHaveBeenCalled();
    });

    it("does not require a session for an unrelated public API", async () => {
      signedOut();

      const response = await proxy(buildRequest("/api/health"));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(getTokenMock).not.toHaveBeenCalled();
    });
  });
});
