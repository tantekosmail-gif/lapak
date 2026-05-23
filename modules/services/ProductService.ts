import { prisma } from "@/app/lib/prisma";
import { BaseService, Response } from "../core";
import {
    CreateProductDto,
    createProductSchema,
    SaveAllProductDto,
    saveAllProductSchema,
    UpdateProductDto,
    updateProductSchema,
} from "../dto/Product.dto";
import { ProductEntity } from "../entities/Product";
import { productRepository, ProductRepository } from "../repositories/ProductRepository";
import { Paginations } from "../statics/Paginations";

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

export class ProductService extends BaseService<ProductRepository> {
    async getAll(
        page: number = 1,
        limit: number = 10,
        sortBy: string = "createdAt",
        sortDir: string = "desc",
        search: string,
    ): Promise<Response<ProductEntity[]>> {
        const { skip, take } = Paginations.getPaging(page, limit);
        try {
            const products = await this.repository.findMany({
                skip,
                take,
                where: search
                    ? {
                          name: {
                              contains: search,
                          },
                      }
                    : undefined,
                orderBy: { [sortBy]: sortDir },
            });
            return this.ok(products);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_FIND_FAILED");
        }
    }

    async findById(id: string): Promise<Response<ProductEntity>> {
        try {
            const product = await this.repository.findById(Number(id));
            if (product === null) {
                return this.wrapError(new Error("Product not found"), "PRODUCT_NOT_FOUND");
            }
            return this.ok(product);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_FIND_FAILED");
        }
    }

    async create(body: CreateProductDto): Promise<Response<ProductEntity>> {
        const parsed = createProductSchema.safeParse(body);
        if (!parsed.success) {
            return this.fail("PRODUCT_VALIDATION_FAILED", "Invalid product payload", parsed.error.issues);
        }
        try {
            const data = parsed.data;
            const product = await this.repository.create({
                name: data.name,
                price: data.price,
                stock: data.stock ?? 0,
                sold: data.sold ?? 0,
                imageUrl: data.imageUrl,
                status: data.status,
                slug: data.slug ?? slugify(data.name),
                category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
            });
            return this.ok(product);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CREATE_FAILED");
        }
    }

    async update(id: string, body: UpdateProductDto): Promise<Response<ProductEntity>> {
        const parsed = updateProductSchema.safeParse(body);
        if (!parsed.success) {
            return this.fail("PRODUCT_VALIDATION_FAILED", "Invalid product payload", parsed.error.issues);
        }
        try {
            const find = await this.repository.findById(Number(id));
            if (find === null) {
                return this.wrapError(new Error("Product not found"), "PRODUCT_NOT_FOUND");
            }
            const data = parsed.data;
            const product = await this.repository.updateById(Number(id), {
                name: data.name,
                price: data.price,
                stock: data.stock,
                sold: data.sold,
                imageUrl: data.imageUrl,
                status: data.status,
                slug: data.slug,
                category:
                    data.categoryId !== undefined
                        ? { connect: { id: data.categoryId } }
                        : undefined,
            });
            return this.ok(product);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_UPDATE_FAILED");
        }
    }

    async delete(id: string): Promise<Response<ProductEntity>> {
        try {
            const find = await this.repository.findById(Number(id));
            if (find === null) {
                return this.wrapError(new Error("Product not found"), "PRODUCT_NOT_FOUND");
            }
            const product = await this.repository.deleteById(Number(id));
            return this.ok(product);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_DELETE_FAILED");
        }
    }

    async saveAll(body: SaveAllProductDto): Promise<Response<ProductEntity>> {
        const parsed = saveAllProductSchema.safeParse(body);
        if (!parsed.success) {
            return this.fail("PRODUCT_VALIDATION_FAILED", "Invalid payload", parsed.error.issues);
        }
        try {
            const { category, product } = parsed.data;
            const result = await prisma.$transaction(async (tx) => {
                const newCategory = await tx.productCategories.create({
                    data: {
                        name: category.name,
                        image: category.image,
                    },
                });
                const newProduct = await tx.product.create({
                    data: {
                        name: product.name,
                        price: product.price,
                        stock: product.stock ?? 0,
                        sold: product.sold ?? 0,
                        imageUrl: product.imageUrl,
                        status: product.status,
                        slug: product.slug ?? slugify(product.name),
                        category: { connect: { id: newCategory.id } },
                    },
                });
                return newProduct;
            });
            return this.ok(result);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_SAVE_ALL_FAILED");
        }
    }
}

const productService = new ProductService(productRepository);

export default productService;
