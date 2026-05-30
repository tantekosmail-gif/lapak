import { Prisma } from "@/app/generated/prisma/client";
import { BaseRepository } from "../core";
import type { CartEntity } from "../entities/Cart";
import { prisma } from "@/app/lib/prisma";

export class CartRepository extends BaseRepository<
    CartEntity,
    Prisma.CartWhereUniqueInput,
    Prisma.CartWhereInput,
    Prisma.CartCreateInput,
    Prisma.CartUpdateInput
> {
    constructor() {
        super(prisma.cart);
    }
}

export const cartRepository = new CartRepository();
