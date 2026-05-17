import "@/tests/mocks/prisma";
import "@/tests/mocks/google-auth";

import { NextRequest } from "next/server";
import { signedInAs, signedOut, getTokenMock } from "@/tests/mocks/google-auth";
import { proxy, config } from "@/proxy";

const buildRequest = (pathname: string, init?: RequestInit | any) =>
  new NextRequest(`http://localhost:3000${pathname}`, init);

describe("proxy (API auth gate for app/api/(auth)/**)", () => {
  describe("matcher config", () => {
    it("limits the proxy to /api/* paths", () => {
      expect(config.matcher).toBe("/api/:path*");
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
