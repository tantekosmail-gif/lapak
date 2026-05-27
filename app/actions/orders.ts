"use server";

import { prisma } from "../lib/prisma";

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteOrder(id: string) {
  return prisma.order.delete({ where: { id: Number(id) } });
}


