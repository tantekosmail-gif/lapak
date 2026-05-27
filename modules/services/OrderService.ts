import { prisma } from "@/app/lib/prisma";
import { OrderStatus } from "@/app/generated/prisma/client";
import { BaseService, Response } from "../core";
import {
  createOrderSchema,
  createOrderAdminSchema,
  type CreateOrderDto,
  type CreateOrderAdminDto,
  type OrderItemInput,
} from "../dto/Order.dto";
import type { OrderWithItems } from "../entities/Order";
import {
  orderRepository,
  OrderRepository,
} from "../repositories/OrderRepository";

const generateOrderNumber = () =>
  `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

export class OrderService extends BaseService<OrderRepository> {
  constructor(repository: OrderRepository = orderRepository) {
    super(repository);
  }

  /** Customer membuat order untuk dirinya sendiri. */
  async create(
    customerId: number,
    body: CreateOrderDto,
  ): Promise<Response<OrderWithItems>> {
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return this.fail(
        "ORDER_VALIDATION_FAILED",
        "Invalid order payload",
        parsed.error.issues,
      );
    }
    return this.persist(customerId, parsed.data.items);
  }

  /** Admin membuat order atas nama customer tertentu. */
  async createAsAdmin(
    body: CreateOrderAdminDto,
  ): Promise<Response<OrderWithItems>> {
    const parsed = createOrderAdminSchema.safeParse(body);
    if (!parsed.success) {
      return this.fail(
        "ORDER_VALIDATION_FAILED",
        "Invalid order payload",
        parsed.error.issues,
      );
    }
    return this.persist(parsed.data.customerId, parsed.data.items);
  }

  /** Customer (pemilik) meminta pembatalan: MENUNGGU/DIPROSES -> MENUNGGU_PEMBATALAN. */
  async requestCancel(
    id: number,
    customerId: number,
  ): Promise<Response<OrderWithItems>> {
    return this.transition(id, {
      from: [OrderStatus.MENUNGGU, OrderStatus.DIPROSES],
      to: OrderStatus.MENUNGGU_PEMBATALAN,
      ownerId: customerId,
      failCode: "ORDER_CANCEL_REQUEST_FAILED",
    });
  }

  /** Admin menyetujui pengemasan: MENUNGGU -> DIPROSES. */
  async approve(id: number): Promise<Response<OrderWithItems>> {
    return this.transition(id, {
      from: [OrderStatus.MENUNGGU],
      to: OrderStatus.DIPROSES,
      failCode: "ORDER_APPROVE_FAILED",
    });
  }

  /** Admin menyetujui pembatalan: MENUNGGU_PEMBATALAN -> DIBATALKAN. */
  async cancelApprove(id: number): Promise<Response<OrderWithItems>> {
    return this.transition(id, {
      from: [OrderStatus.MENUNGGU_PEMBATALAN],
      to: OrderStatus.DIBATALKAN,
      failCode: "ORDER_CANCEL_APPROVE_FAILED",
    });
  }

  /** Admin mengirim pesanan: DIPROSES -> DIKIRIM. */
  async send(id: number): Promise<Response<OrderWithItems>> {
    return this.transition(id, {
      from: [OrderStatus.DIPROSES],
      to: OrderStatus.DIKIRIM,
      failCode: "ORDER_SEND_FAILED",
    });
  }

  // Hitung harga/subtotal dari DB (jangan percaya angka dari client) lalu simpan
  // order + item dalam satu transaksi.
  private async persist(
    customerId: number,
    items: OrderItemInput[],
  ): Promise<Response<OrderWithItems>> {
    try {
      const order = await prisma.$transaction(async (tx) => {
        const customer = await tx.user.findUnique({
          where: { id: customerId },
        });
        if (!customer) throw new Error(`Customer ${customerId} not found`);

        const products = await tx.product.findMany({
          where: { id: { in: items.map((item) => item.productId) } },
        });
        const productById = new Map(products.map((p) => [p.id, p]));

        const lineItems = items.map((item) => {
          const product = productById.get(item.productId);
          if (!product) throw new Error(`Product ${item.productId} not found`);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            subtotal: product.price * item.quantity,
          };
        });

        const total = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
        const itemsCount = lineItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        return tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customer: { connect: { id: customerId } },
            total,
            itemsCount,
            status: OrderStatus.MENUNGGU,
            items: {
              create: lineItems.map((item) => ({
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
                product: { connect: { id: item.productId } },
              })),
            },
          },
          include: { items: true },
        });
      });
      return this.ok(order);
    } catch (error) {
      return this.wrapError(error, "ORDER_CREATE_FAILED");
    }
  }

  // Guard transisi status: cek order ada, kepemilikan (opsional), dan state asal valid.
  private async transition(
    id: number,
    opts: {
      from: OrderStatus[];
      to: OrderStatus;
      failCode: string;
      ownerId?: number;
    },
  ): Promise<Response<OrderWithItems>> {
    try {
      const order = await this.repository.findById(id);
      if (!order) {
        return this.fail("ORDER_NOT_FOUND", `Order ${id} not found`);
      }
      if (opts.ownerId !== undefined && order.customerId !== opts.ownerId) {
        return this.fail("ORDER_FORBIDDEN", "You do not own this order");
      }
      if (!opts.from.includes(order.status)) {
        return this.fail(
          "ORDER_INVALID_STATE",
          `Cannot move order from ${order.status} to ${opts.to}`,
        );
      }
      const updated = await prisma.order.update({
        where: { id },
        data: { status: opts.to },
        include: { items: true },
      });
      return this.ok(updated);
    } catch (error) {
      return this.wrapError(error, opts.failCode);
    }
  }
}

const orderService = new OrderService();

export default orderService;
