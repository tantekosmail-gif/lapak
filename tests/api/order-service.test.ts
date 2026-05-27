import "@/tests/mocks/prisma";

import { prismaMock, resetPrismaMock } from "@/tests/mocks/prisma";
import { OrderService } from "@/modules/services/OrderService";

const service = new OrderService();

beforeEach(() => {
  resetPrismaMock();
});

describe("OrderService", () => {
  describe("create", () => {
    it("computes price/subtotal/total from DB and creates a MENUNGGU order", async () => {
      // $transaction callback dijalankan dengan prismaMock sebagai tx.
      prismaMock.$transaction.mockImplementation((cb: any) => cb(prismaMock));
      prismaMock.user.findUnique.mockResolvedValue({ id: 7 });
      prismaMock.product.findMany.mockResolvedValue([
        { id: 1, price: 1000 },
        { id: 2, price: 2500 },
      ]);
      const created = { id: 99, status: "MENUNGGU", items: [] };
      prismaMock.order.create.mockResolvedValue(created);

      const result = await service.create(7, {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      });

      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual(created);

      const arg = prismaMock.order.create.mock.calls[0][0];
      // total = 1000*2 + 2500*1 = 4500 ; itemsCount = 2 + 1 = 3
      expect(arg.data.total).toBe(4500);
      expect(arg.data.itemsCount).toBe(3);
      expect(arg.data.status).toBe("MENUNGGU");
      expect(arg.data.customer).toEqual({ connect: { id: 7 } });
      expect(arg.data.items.create).toEqual([
        { quantity: 2, price: 1000, subtotal: 2000, product: { connect: { id: 1 } } },
        { quantity: 1, price: 2500, subtotal: 2500, product: { connect: { id: 2 } } },
      ]);
    });

    it("rejects invalid payloads (empty items)", async () => {
      const result = await service.create(7, { items: [] });

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("ORDER_VALIDATION_FAILED");
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("fails when a product does not exist", async () => {
      prismaMock.$transaction.mockImplementation((cb: any) => cb(prismaMock));
      prismaMock.user.findUnique.mockResolvedValue({ id: 7 });
      prismaMock.product.findMany.mockResolvedValue([]); // produk 1 tidak ada

      const result = await service.create(7, {
        items: [{ productId: 1, quantity: 1 }],
      });

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("ORDER_CREATE_FAILED");
    });
  });

  describe("approve (MENUNGGU -> DIPROSES)", () => {
    it("moves a MENUNGGU order to DIPROSES", async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: 1, status: "MENUNGGU", customerId: 7 });
      prismaMock.order.update.mockResolvedValue({ id: 1, status: "DIPROSES", items: [] });

      const result = await service.approve(1);

      expect(result.success).toBe(true);
      expect(prismaMock.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: "DIPROSES" },
        include: { items: true },
      });
    });

    it("rejects when the order is not in MENUNGGU", async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: 1, status: "DIKIRIM", customerId: 7 });

      const result = await service.approve(1);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("ORDER_INVALID_STATE");
      expect(prismaMock.order.update).not.toHaveBeenCalled();
    });

    it("returns ORDER_NOT_FOUND for a missing order", async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      const result = await service.approve(123);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("ORDER_NOT_FOUND");
    });
  });

  describe("send (DIPROSES -> DIKIRIM)", () => {
    it("moves a DIPROSES order to DIKIRIM", async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: 1, status: "DIPROSES", customerId: 7 });
      prismaMock.order.update.mockResolvedValue({ id: 1, status: "DIKIRIM", items: [] });

      const result = await service.send(1);

      expect(result.success).toBe(true);
      expect(prismaMock.order.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: "DIKIRIM" } }),
      );
    });
  });

  describe("requestCancel (owner only, -> MENUNGGU_PEMBATALAN)", () => {
    it("lets the owner request cancellation of a MENUNGGU order", async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: 1, status: "MENUNGGU", customerId: 7 });
      prismaMock.order.update.mockResolvedValue({ id: 1, status: "MENUNGGU_PEMBATALAN", items: [] });

      const result = await service.requestCancel(1, 7);

      expect(result.success).toBe(true);
      expect(prismaMock.order.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: "MENUNGGU_PEMBATALAN" } }),
      );
    });

    it("forbids a non-owner from requesting cancellation", async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: 1, status: "MENUNGGU", customerId: 7 });

      const result = await service.requestCancel(1, 999);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("ORDER_FORBIDDEN");
      expect(prismaMock.order.update).not.toHaveBeenCalled();
    });

    it("cannot cancel an already shipped order", async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: 1, status: "DIKIRIM", customerId: 7 });

      const result = await service.requestCancel(1, 7);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("ORDER_INVALID_STATE");
    });
  });

  describe("cancelApprove (MENUNGGU_PEMBATALAN -> DIBATALKAN)", () => {
    it("approves cancellation of an order pending cancellation", async () => {
      prismaMock.order.findUnique.mockResolvedValue({
        id: 1,
        status: "MENUNGGU_PEMBATALAN",
        customerId: 7,
      });
      prismaMock.order.update.mockResolvedValue({ id: 1, status: "DIBATALKAN", items: [] });

      const result = await service.cancelApprove(1);

      expect(result.success).toBe(true);
      expect(prismaMock.order.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: "DIBATALKAN" } }),
      );
    });

    it("rejects cancel-approve when no cancellation was requested", async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: 1, status: "MENUNGGU", customerId: 7 });

      const result = await service.cancelApprove(1);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("ORDER_INVALID_STATE");
    });
  });
});
