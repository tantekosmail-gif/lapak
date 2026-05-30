import "@/tests/mocks/prisma";

import { prismaMock, resetPrismaMock } from "@/tests/mocks/prisma";
import { RatingService } from "@/modules/services/RatingService";

const service = new RatingService();

beforeEach(() => {
  resetPrismaMock();
});

describe("RatingService", () => {
  describe("createOrUpdate", () => {
    it("upserts a rating for the (user, product) pair", async () => {
      prismaMock.product.findUnique.mockResolvedValue({ id: 5 });
      const created = { id: 1, rating: 5, comment: "Mantap", userId: 7, productId: 5 };
      prismaMock.rating.upsert.mockResolvedValue(created);

      const result = await service.createOrUpdate(7, 5, { rating: 5, comment: "Mantap" });

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual(created);
      expect(prismaMock.rating.upsert).toHaveBeenCalledWith({
        where: { userId_productId: { userId: 7, productId: 5 } },
        create: expect.objectContaining({
          rating: 5,
          comment: "Mantap",
          user: { connect: { id: 7 } },
          product: { connect: { id: 5 } },
        }),
        update: expect.objectContaining({ rating: 5, comment: "Mantap" }),
      });
    });

    it("rejects out-of-range rating values", async () => {
      const tooLow = await service.createOrUpdate(7, 5, { rating: 0 } as never);
      const tooHigh = await service.createOrUpdate(7, 5, { rating: 6 } as never);

      expect(tooLow.success).toBe(false);
      expect(tooHigh.success).toBe(false);
      if (!tooLow.success) expect(tooLow.error.code).toBe("RATING_VALIDATION_FAILED");
      if (!tooHigh.success) expect(tooHigh.error.code).toBe("RATING_VALIDATION_FAILED");
      expect(prismaMock.rating.upsert).not.toHaveBeenCalled();
    });

    it("returns PRODUCT_NOT_FOUND when the product does not exist", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const result = await service.createOrUpdate(7, 999, { rating: 5 });

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
      expect(prismaMock.rating.upsert).not.toHaveBeenCalled();
    });
  });

  describe("listByProduct", () => {
    it("paginates and includes user info", async () => {
      const sample = [
        { id: 1, rating: 5, comment: "Top", userId: 7, productId: 5, user: { id: 7, name: "Jane", image: null } },
      ];
      prismaMock.rating.findMany.mockResolvedValue(sample);

      const result = await service.listByProduct(5, 2, 20, "asc");

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual(sample);
      expect(prismaMock.rating.findMany).toHaveBeenCalledWith({
        where: { productId: 5 },
        skip: 20,
        take: 20,
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true, image: true } } },
      });
    });
  });

  describe("summaryByProduct", () => {
    it("returns average and count from aggregate", async () => {
      prismaMock.rating.aggregate.mockResolvedValue({
        _avg: { rating: 4.25 },
        _count: { _all: 12 },
      });

      const result = await service.summaryByProduct(5);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ productId: 5, average: 4.25, count: 12 });
      }
    });

    it("defaults to 0/0 when there are no ratings", async () => {
      prismaMock.rating.aggregate.mockResolvedValue({
        _avg: { rating: null },
        _count: { _all: 0 },
      });

      const result = await service.summaryByProduct(5);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ productId: 5, average: 0, count: 0 });
      }
    });
  });
});
