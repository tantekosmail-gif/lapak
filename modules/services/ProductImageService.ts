import { prisma } from "@/app/lib/prisma";
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

/**
 * Mengelola galeri gambar produk. Invarian yang dijaga:
 *  - paling banyak satu `ProductImage.isPrimary = true` per produk;
 *  - `Product.imageUrl` selalu mencerminkan URL primary terkini (atau
 *    `null` kalau galeri kosong).
 */
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
            const firstSortOrder = offset;
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
                    // Hanya file pertama yang berpotensi jadi primary, sesuai input.
                    isPrimary: offset === firstSortOrder ? options.isPrimary ?? false : false,
                    product: { connect: { id: options.productId } },
                });
                created.push(record);
                offset += 1;
            }

            // Sinkronkan Product.imageUrl bila ada primary yang baru di-attach.
            const newPrimary = created.find((r) => r.isPrimary);
            if (newPrimary) {
                await prisma.productImage.updateMany({
                    where: { productId: options.productId, id: { not: newPrimary.id } },
                    data: { isPrimary: false },
                });
                await prisma.product.update({
                    where: { id: options.productId },
                    data: { imageUrl: newPrimary.url },
                });
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

            // Untuk tiap produk yang kehilangan primary-nya: promosikan kandidat
            // berikutnya (sortOrder terkecil) atau kosongkan `Product.imageUrl`.
            const orphanedProductIds = Array.from(
                new Set(images.filter((i) => i.isPrimary).map((i) => i.productId)),
            );
            for (const productId of orphanedProductIds) {
                const next = await prisma.productImage.findFirst({
                    where: { productId },
                    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
                });
                if (next) {
                    await prisma.productImage.update({
                        where: { id: next.id },
                        data: { isPrimary: true },
                    });
                    await prisma.product.update({
                        where: { id: productId },
                        data: { imageUrl: next.url },
                    });
                } else {
                    await prisma.product.update({
                        where: { id: productId },
                        data: { imageUrl: null },
                    });
                }
            }

            return this.ok({ deleted });
        } catch (error) {
            return this.wrapError(error, "PRODUCT_IMAGE_DETACH_FAILED");
        }
    }

    /**
     * Menetapkan satu `ProductImage` sebagai primary; sekaligus menurunkan
     * primary lama (kalau ada) dan menyamakan `Product.imageUrl` dengan URL
     * gambar yang dipilih.
     */
    async setPrimary(
        productId: number,
        imageId: number,
    ): Promise<Response<ProductImageEntity>> {
        try {
            const image = await prisma.productImage.findFirst({
                where: { id: imageId, productId },
            });
            if (!image) {
                return this.fail(
                    "PRODUCT_IMAGE_NOT_FOUND",
                    `Image ${imageId} not in product ${productId}`,
                );
            }
            await prisma.$transaction([
                prisma.productImage.updateMany({
                    where: { productId, id: { not: imageId } },
                    data: { isPrimary: false },
                }),
                prisma.productImage.update({
                    where: { id: imageId },
                    data: { isPrimary: true },
                }),
                prisma.product.update({
                    where: { id: productId },
                    data: { imageUrl: image.url },
                }),
            ]);
            return this.ok({ ...image, isPrimary: true });
        } catch (error) {
            return this.wrapError(error, "PRODUCT_IMAGE_SET_PRIMARY_FAILED");
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
