import { Prisma } from "@/app/generated/prisma/client";
import { BaseRepository } from "../core";
import type { OrderEntity } from "../entities/Order";
import { prisma } from "@/app/lib/prisma";

export class OrderRepository extends BaseRepository<
  OrderEntity,
  Prisma.OrderWhereUniqueInput,
  Prisma.OrderWhereInput,
  Prisma.OrderCreateInput,
  Prisma.OrderUpdateInput
> {
  constructor() {
    super(prisma.order);
  }

  findById(id: number) {
    return this.delegate.findUnique({ where: { id } });
  }
}

export const orderRepository = new OrderRepository();
