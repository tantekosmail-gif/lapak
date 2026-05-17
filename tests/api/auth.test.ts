import "@/tests/mocks/prisma";
import "@/tests/mocks/google-auth";

import { prismaMock } from "@/tests/mocks/prisma";
import { mockGoogleProfile } from "@/tests/mocks/google-auth";
import { authOptions } from "@/app/lib/auth";

describe("authOptions.callbacks", () => {
  describe("signIn", () => {
    const signIn = authOptions.callbacks!.signIn!;

    it("upserts the user and allows sign in when email is present", async () => {
      prismaMock.user.upsert.mockResolvedValue({
        id: 42,
        email: mockGoogleProfile.email,
        name: mockGoogleProfile.name,
        image: mockGoogleProfile.image,
      });

      const result = await signIn({
        user: {
          id: "google-id",
          email: mockGoogleProfile.email,
          name: mockGoogleProfile.name,
          image: mockGoogleProfile.image,
        },
      } as Parameters<typeof signIn>[0]);

      expect(result).toBe(true);
      expect(prismaMock.user.upsert).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: mockGoogleProfile.email },
        }),
      );
    });

    it("rejects sign in when the user has no email", async () => {
      const result = await signIn({
        user: { id: "google-id", email: null },
      } as Parameters<typeof signIn>[0]);

      expect(result).toBe(false);
      expect(prismaMock.user.upsert).not.toHaveBeenCalled();
    });

    it("rejects sign in when the upsert validation fails", async () => {
      const result = await signIn({
        user: { id: "google-id", email: "not-an-email" },
      } as Parameters<typeof signIn>[0]);

      expect(result).toBe(false);
      expect(prismaMock.user.upsert).not.toHaveBeenCalled();
    });
  });

  describe("jwt", () => {
    const jwt = authOptions.callbacks!.jwt!;

    it("attaches the database id to the token on first sign in", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 7,
        email: mockGoogleProfile.email,
        name: mockGoogleProfile.name,
        image: mockGoogleProfile.image,
      });

      const token = await jwt({
        token: {},
        user: {
          id: "google-id",
          email: mockGoogleProfile.email,
        },
      } as Parameters<typeof jwt>[0]);

      expect(token.id).toBe(7);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockGoogleProfile.email },
      });
    });

    it("returns the token untouched when no user is present", async () => {
      const token = await jwt({
        token: { existing: "value" },
      } as Parameters<typeof jwt>[0]);

      expect(token).toEqual({ existing: "value" });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });
  });

  describe("session", () => {
    const session = authOptions.callbacks!.session!;

    it("copies the numeric id from the token into the session user", async () => {
      const result = await session({
        session: {
          user: { email: mockGoogleProfile.email },
          expires: new Date().toISOString(),
        },
        token: { id: 99 },
      } as Parameters<typeof session>[0]);

      expect(result.user?.id).toBe(99);
    });

    it("leaves the session alone when the token has no numeric id", async () => {
      const result = await session({
        session: {
          user: { email: mockGoogleProfile.email },
          expires: new Date().toISOString(),
        },
        token: {},
      } as Parameters<typeof session>[0]);

      expect(result.user?.id).toBeUndefined();
    });
  });
});
