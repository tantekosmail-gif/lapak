import { BaseService, Response } from "../core";
import { ProductImageEntity } from "../entities/ProductImage";
import {
    productImageRepository,
    ProductImageRepository,
} from "../repositories/ProductImageRepository";
import { productRepository } from "../repositories/ProductRepository";
import uploadService, { UploadService } from "./UploadService";

export type AttachOptions = {
    productId: number;
    sortOrder?: number;
    isPrimary?: boolean;
};

export class ProductImageService extends BaseService<ProductImageRepository> {
    constructor(
        repository: ProductImageRepository = productImageRepository,
        private readonly uploader: UploadService = uploadService,
    ) {
        super(repository);
    }

    async attachMany(
        files: File[],
        options: AttachOptions,
    ): Promise<Response<ProductImageEntity[]>> {
        if (!files.length) {
            return this.fail("PRODUCT_IMAGE_NO_FILES", "At least one file is required");
        }

        try {
            const product = await productRepository.findById(options.productId);
            if (!product) {
                return this.fail("PRODUCT_NOT_FOUND", `Product ${options.productId} not found`);
            }
        } catch (error) {
            return this.wrapError(error, "PRODUCT_IMAGE_ATTACH_FAILED");
        }

        const created: ProductImageEntity[] = [];
        const uploaded: string[] = [];

        try {
            let offset = options.sortOrder ?? 0;
            for (const file of files) {
                const upload = await this.uploader.saveImage(file);
                if (!upload.success) {
                    await this.rollback(uploaded, created);
                    return this.fail(upload.error.code, upload.error.message, upload.error.details);
                }
                uploaded.push(upload.data.url);

                const record = await this.repository.create({
                    url: upload.data.url,
                    sortOrder: offset,
                    isPrimary: offset === (options.sortOrder ?? 0) ? options.isPrimary ?? false : false,
                    product: { connect: { id: options.productId } },
                });
                created.push(record);
                offset += 1;
            }
            return this.ok(created);
        } catch (error) {
            await this.rollback(uploaded, created);
            return this.wrapError(error, "PRODUCT_IMAGE_ATTACH_FAILED");
        }
    }

    async detach(ids: number[]): Promise<Response<{ deleted: number[] }>> {
        if (!ids.length) {
            return this.fail("PRODUCT_IMAGE_NO_IDS", "At least one image id is required");
        }

        try {
            const images = await this.repository.findManyByIds(ids);
            if (!images.length) {
                return this.fail("PRODUCT_IMAGE_NOT_FOUND", "No matching images");
            }

            const deleted: number[] = [];
            for (const image of images) {
                await this.repository.deleteById(image.id);
                await this.uploader.deleteByUrl(image.url);
                deleted.push(image.id);
            }
            return this.ok({ deleted });
        } catch (error) {
            return this.wrapError(error, "PRODUCT_IMAGE_DETACH_FAILED");
        }
    }

    private async rollback(uploadedUrls: string[], createdRecords: ProductImageEntity[]) {
        for (const record of createdRecords) {
            await this.repository.deleteById(record.id).catch(() => undefined);
        }
        for (const url of uploadedUrls) {
            await this.uploader.deleteByUrl(url).catch(() => undefined);
        }
    }
}

const productImageService = new ProductImageService();

export default productImageService;
