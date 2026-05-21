"use server";

import { prisma } from "../lib/prisma";

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}