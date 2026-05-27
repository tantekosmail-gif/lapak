import "@/tests/mocks/prisma";
import "@/tests/mocks/google-auth";

import { prismaMock } from "@/tests/mocks/prisma";
import { mockGoogleProfile } from "@/tests/mocks/google-auth";
import { userService } from "@/modules/services/UserService";

describe("UserService", () => {
  describe("findByEmail", () => {
    it("returns an ok response wrapping the prisma user", async () => {
      const dbUser = {
        id: 1,
        email: mockGoogleProfile.email,
        name: mockGoogleProfile.name,
        image: mockGoogleProfile.image,
      };
      prismaMock.user.findUnique.mockResolvedValue(dbUser);

      const result = await userService.findByEmail(mockGoogleProfile.email);

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual(dbUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockGoogleProfile.email },
      });
    });

    it("wraps thrown errors as USER_FIND_FAILED", async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error("boom"));

      const result = await userService.findByEmail(mockGoogleProfile.email);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("USER_FIND_FAILED");
        expect(result.error.message).toBe("boom");
      }
    });
  });

  describe("findAdminByEmail", () => {
    it("returns the user when userType is ADMIN", async () => {
      const adminUser = {
        id: 9,
        email: "admin@example.com",
        name: "Admin",
        image: null,
        userType: "ADMIN",
      };
      prismaMock.user.findFirst.mockResolvedValue(adminUser);

      const result = await userService.findAdminByEmail("admin@example.com");

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual(adminUser);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: "admin@example.com", userType: "ADMIN" },
      });
    });

    it("returns null when no admin matches", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userService.findAdminByEmail("foo@example.com");

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBeNull();
    });
  });

  describe("upsertFromGoogle", () => {
    it("upserts a valid Google profile and returns the entity", async () => {
      const created = {
        id: 5,
        email: mockGoogleProfile.email,
        name: mockGoogleProfile.name,
        image: mockGoogleProfile.image,
      };
      prismaMock.user.upsert.mockResolvedValue(created);

      const result = await userService.upsertFromGoogle({
        email: mockGoogleProfile.email,
        name: mockGoogleProfile.name,
        image: mockGoogleProfile.image,
      });

      expect(result.success).toBe(true);
      expect(prismaMock.user.upsert).toHaveBeenCalledWith({
        where: { email: mockGoogleProfile.email },
        create: {
          email: mockGoogleProfile.email,
          name: mockGoogleProfile.name,
          image: mockGoogleProfile.image,
        },
        update: {
          name: mockGoogleProfile.name,
          image: mockGoogleProfile.image,
        },
      });
    });

    it("returns a validation failure for invalid email", async () => {
      const result = await userService.upsertFromGoogle({
        email: "not-an-email",
        name: null,
        image: null,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("USER_VALIDATION_FAILED");
      }
      expect(prismaMock.user.upsert).not.toHaveBeenCalled();
    });
  });
});
