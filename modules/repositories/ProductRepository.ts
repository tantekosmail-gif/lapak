import { Prisma } from "@/app/generated/prisma/client";
import { BaseRepository } from "../core";
import { ProductEntity } from "../entities/Product";
import { prisma } from "@/app/lib/prisma";


export class ProductRepository extends BaseRepository<
    ProductEntity,
    Prisma.ProductWhereUniqueInput,
    Prisma.ProductWhereInput,
    Prisma.ProductCreateInput,
    Prisma.ProductUpdateInput
> {
    constructor() {
        super(prisma.product);
    }

    findById(id: number) {
        return this.delegate.findFirst({ where: { id: Number(id) } });
    }

    updateById(id: number, body: Prisma.ProductUpdateInput) {
        return this.delegate.update({ where: { id: Number(id) }, data: body });
    }

    deleteById(id: number) {
        return this.delegate.delete({ where: { id: Number(id) } });
    }
}

export const productRepository = new ProductRepository();
