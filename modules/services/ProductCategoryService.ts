import { prisma } from "@/app/lib/prisma";
import { BaseService, Response } from "../core";
import { CreateProductCategoriesDto, UpdateProductCategoriesDto } from "../dto/ProductCategories.dto";
import { ProductCategoryEntity, ProductCategoryListItem, ProductCategoryWithProducts } from "../entities/ProductCategories";
import { productCategoryRepository, ProductCategoryRepository } from "../repositories/ProductCategoryRepository";
import { Paginations } from "../statics/Paginations";

export class ProductCategoryService extends BaseService<ProductCategoryRepository> {
    async update(id: string, body: UpdateProductCategoriesDto) {
        try {
            const find = await this.repository.findById(Number(id));
            if (find === null) {
                return this.wrapError(new Error("Product category not found"), "PRODUCT_CATEGORY_NOT_FOUND");
            }
            const category = await this.repository.updateById(Number(id), body);
            return this.ok(category);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_UPDATE_FAILED");
        }
    }
    async delete(id: string) {
        try {
            const find = await this.repository.findById(Number(id));
            if (find === null) {
                return this.wrapError(new Error("Product category not found"), "PRODUCT_CATEGORY_NOT_FOUND");
            }
            // Cegah delete bila masih ada produk yang merujuk kategori ini.
            const productCount = await prisma.product.count({
                where: { categoryId: Number(id) },
            });
            if (productCount > 0) {
                return this.fail(
                    "CATEGORY_HAS_PRODUCTS",
                    `Cannot delete: ${productCount} product(s) still belong to this category`,
                    { productCount },
                );
            }
            const category = await this.repository.deleteById(Number(id));
            return this.ok(category);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_DELETE_FAILED");
        }
    }

    /**
     * Detail kategori berdasarkan slug-name. Slug = `name` di-lowercase +
     * spasi diganti hyphen (lihat helper `slugify` di klien). Cocok untuk
     * URL storefront `/collections/[slug]`.
     *
     * Pencarian dilakukan case-insensitive dengan menukar hyphen ke spasi.
     * Aman untuk seed yang nama-nya hanya kata-kata berhuruf (Batik Tulis,
     * Aksesoris, dll.) — kategori dengan karakter spesial mungkin tidak
     * ter-resolve tanpa kolom `slug` di schema.
     */
    async findBySlugWithProducts(slug: string): Promise<Response<ProductCategoryWithProducts>> {
        try {
            const deslug = slug.replace(/-/g, " ");
            const category = await prisma.productCategories.findFirst({
                where: { name: { equals: deslug, mode: "insensitive" } },
                include: { products: true },
            });
            if (!category) {
                return this.fail(
                    "PRODUCT_CATEGORY_NOT_FOUND",
                    `No category matches slug "${slug}"`,
                );
            }
            return this.ok(category);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_FIND_FAILED");
        }
    }

    /** Detail kategori beserta semua produk di dalamnya. Dipakai halaman view. */
    async findByIdWithProducts(id: string): Promise<Response<ProductCategoryWithProducts>> {
        try {
            const category = await prisma.productCategories.findFirst({
                where: { id: Number(id) },
                include: { products: true },
            });
            if (category === null) {
                return this.fail("PRODUCT_CATEGORY_NOT_FOUND", "Product category not found");
            }
            return this.ok(category);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_FIND_FAILED");
        }
    }
    async findById(id: string): Promise<Response<ProductCategoryEntity>> {
        try {
            const category = await this.repository.findById(Number(id));
            if (category === null) {
                return this.wrapError(new Error("Product category not found"), "PRODUCT_CATEGORY_NOT_FOUND");
            }
            return this.ok(category);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_FIND_FAILED");
        }
    }
    async getAll(
        page: number = 1,
        limit: number = 10,
        sortBy: string = "createdAt",
        sortDir: string = "desc",
        search: string
    ): Promise<Response<ProductCategoryListItem[]>> {
        const { skip, take } = Paginations.getPaging(page, limit);
        try {
            const categories = await prisma.productCategories.findMany({
                skip,
                take,
                where: search ? { name: { contains: search } } : undefined,
                orderBy: { [sortBy]: sortDir },
                // Sertakan jumlah produk per kategori (`_count.products`)
                // sehingga kartu di storefront dapat menampilkannya tanpa N+1.
                include: { _count: { select: { products: true } } },
            });
            return this.ok(categories);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_FIND_FAILED");
        }
    }

    async create(data: CreateProductCategoriesDto) {
        try {
            const category = await this.repository.create(data);
            return this.ok(category);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_CREATE_FAILED");
        }
    }
}

const productCategoryService = new ProductCategoryService(productCategoryRepository);

export default productCategoryService;