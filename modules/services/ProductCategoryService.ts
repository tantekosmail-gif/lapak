import { BaseService, Response } from "../core";
import { CreateProductCategoriesDto, UpdateProductCategoriesDto } from "../dto/ProductCategories.dto";
import { ProductCategoryEntity } from "../entities/ProductCategories";
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
            const category = await this.repository.deleteById(Number(id));
            return this.ok(category);
        } catch (error) {
            return this.wrapError(error, "PRODUCT_CATEGORY_DELETE_FAILED");
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
    ): Promise<Response<ProductCategoryEntity[]>> {
        const { skip, take } = Paginations.getPaging(page, limit);
        let categories: ProductCategoryEntity[] = [];

        try {
            if (search) {
                categories = await this.repository.findMany({
                    skip,
                    take,
                    where: {
                        name: {
                            contains: search
                        }
                    },
                    orderBy: {
                        [sortBy]: sortDir
                    }
                });
                return this.ok(categories);
            }
            categories = await this.repository.findMany({
                skip,
                take,
                orderBy: {
                    [sortBy]: sortDir
                }
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