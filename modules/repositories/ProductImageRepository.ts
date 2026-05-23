import { Prisma } from "@/app/generated/prisma/client";
import { BaseRepository } from "../core";
import { ProductImageEntity } from "../entities/ProductImage";
import { prisma } from "@/app/lib/prisma";

export class ProductImageRepository extends BaseRepository<
    ProductImageEntity,
    Prisma.ProductImageWhereUniqueInput,
    Prisma.ProductImageWhereInput,
    Prisma.ProductImageCreateInput,
    Prisma.ProductImageUpdateInput
> {
    constructor() {
        super(prisma.productImage);
    }

    findById(id: number) {
        return this.delegate.findFirst({ where: { id: Number(id) } });
    }

    findManyByIds(ids: number[]) {
        return this.delegate.findMany({ where: { id: { in: ids } } });
    }

    deleteById(id: number) {
        return this.delegate.delete({ where: { id: Number(id) } });
    }
}

export const productImageRepository = new ProductImageRepository();
