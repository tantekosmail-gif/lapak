import "@/tests/mocks/prisma";

import { prismaMock, resetPrismaMock } from "@/tests/mocks/prisma";
import { CartService } from "@/modules/services/CartService";

const service = new CartService();

beforeEach(() => {
  resetPrismaMock();
});

describe("CartService", () => {
  describe("list", () => {
    it("returns cart entries scoped to the customer with product info", async () => {
      const lines = [
        { id: 1, customerId: 7, productId: 1, qty: 2, product: { id: 1, name: "Kopi" } },
      ];
      prismaMock.cart.findMany.mockResolvedValue(lines);

      const result = await service.list(7);

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual(lines);
      expect(prismaMock.cart.findMany).toHaveBeenCalledWith({
        where: { customerId: 7 },
        include: { product: true },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("add", () => {
    it("upserts and increments existing qty by the supplied amount", async () => {
      prismaMock.product.findUnique.mockResolvedValue({ id: 1 });
      const line = { id: 1, customerId: 7, productId: 1, qty: 3, product: { id: 1 } };
      prismaMock.cart.upsert.mockResolvedValue(line);

      const result = await service.add(7, { productId: 1, qty: 2 });

      expect(result.success).toBe(true);
      expect(prismaMock.cart.upsert).toHaveBeenCalledWith({
        where: { customerId_productId: { customerId: 7, productId: 1 } },
        create: { customerId: 7, productId: 1, qty: 2 },
        update: { qty: { increment: 2 } },
        include: { product: true },
      });
    });

    it("rejects invalid payloads", async () => {
      const result = await service.add(7, { productId: 0 } as never);
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("CART_VALIDATION_FAILED");
      expect(prismaMock.cart.upsert).not.toHaveBeenCalled();
    });

    it("fails when product does not exist", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const result = await service.add(7, { productId: 999, qty: 1 });

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
      expect(prismaMock.cart.upsert).not.toHaveBeenCalled();
    });
  });

  describe("setQuantity", () => {
    it("upserts to an absolute qty when qty > 0", async () => {
      const line = { id: 1, customerId: 7, productId: 1, qty: 5, product: {} };
      prismaMock.cart.upsert.mockResolvedValue(line);

      const result = await service.setQuantity(7, 1, { qty: 5 });

      expect(result.success).toBe(true);
      expect(prismaMock.cart.upsert).toHaveBeenCalledWith({
        where: { customerId_productId: { customerId: 7, productId: 1 } },
        create: { customerId: 7, productId: 1, qty: 5 },
        update: { qty: 5 },
        include: { product: true },
      });
    });

    it("deletes the entry (best-effort) when qty <= 0", async () => {
      prismaMock.cart.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.setQuantity(7, 1, { qty: 0 });

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual({ removed: true });
      expect(prismaMock.cart.deleteMany).toHaveBeenCalledWith({
        where: { customerId: 7, productId: 1 },
      });
      expect(prismaMock.cart.upsert).not.toHaveBeenCalled();
    });
  });

  describe("remove + clear", () => {
    it("remove deletes by composite where (scoped to customer)", async () => {
      prismaMock.cart.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.remove(7, 1);

      expect(result.success).toBe(true);
      expect(prismaMock.cart.deleteMany).toHaveBeenCalledWith({
        where: { customerId: 7, productId: 1 },
      });
    });

    it("clear wipes only this customer's entries", async () => {
      prismaMock.cart.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.clear(7);

      expect(result.success).toBe(true);
      expect(prismaMock.cart.deleteMany).toHaveBeenCalledWith({
        where: { customerId: 7 },
      });
    });
  });
});
