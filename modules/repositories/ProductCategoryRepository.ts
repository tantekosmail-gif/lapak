import { Prisma } from "@/app/generated/prisma/client";
import { BaseRepository } from "../core";
import { ProductCategoryEntity } from "../entities/ProductCategories";
import { prisma } from "@/app/lib/prisma";


export class ProductCategoryRepository extends BaseRepository<
    ProductCategoryEntity,
    Prisma.ProductCategoriesWhereUniqueInput,
    Prisma.ProductCategoriesWhereInput,
    Prisma.ProductCategoriesCreateInput,
    Prisma.ProductCategoriesUpdateInput
> {
    async updateById(id: number, body: any) {
        return this.delegate.update({ where: { id: Number(id) }, data: body });
    }
    findById(id: number) {
        return this.delegate.findFirst({ where: { id: Number(id) } });
    }

    deleteById(id: number) {
        return this.delegate.delete({ where: { id: Number(id) } });
    }

    constructor() {
        super(prisma.productCategories);
    }
}

export const productCategoryRepository = new ProductCategoryRepository();