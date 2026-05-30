import { prisma } from "@/app/lib/prisma";
import { BaseService, Response } from "../core";
import { createRatingSchema, type CreateRatingDto } from "../dto/Rating.dto";
import type {
    RatingEntity,
    RatingSummary,
    RatingWithUser,
} from "../entities/Rating";
import {
    ratingRepository,
    RatingRepository,
} from "../repositories/RatingRepository";
import { Paginations } from "../statics/Paginations";

export class RatingService extends BaseService<RatingRepository> {
    constructor(repository: RatingRepository = ratingRepository) {
        super(repository);
    }

    /**
     * Customer memberi atau memperbarui rating untuk satu produk.
     * Idempotent: satu user hanya boleh punya satu rating per produk
     * (unique composite `(userId, productId)`); panggilan ulang melakukan
     * update bukan insert duplikat.
     */
    async createOrUpdate(
        userId: number,
        productId: number,
        body: CreateRatingDto,
    ): Promise<Response<RatingEntity>> {
        const parsed = createRatingSchema.safeParse(body);
        if (!parsed.success) {
            return this.fail(
                "RATING_VALIDATION_FAILED",
                "Invalid rating payload",
                parsed.error.issues,
            );
        }
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                return this.fail("PRODUCT_NOT_FOUND", `Product ${productId} not found`);
            }
            const rating = await prisma.rating.upsert({
                where: { userId_productId: { userId, productId } },
                create: {
                    rating: parsed.data.rating,
                    comment: parsed.data.comment,
                    user: { connect: { id: userId } },
                    product: { connect: { id: productId } },
                },
                update: {
                    rating: parsed.data.rating,
                    comment: parsed.data.comment,
                },
            });
            return this.ok(rating);
        } catch (error) {
            return this.wrapError(error, "RATING_CREATE_FAILED");
        }
    }

    /** Daftar rating untuk satu produk (paginasi). */
    async listByProduct(
        productId: number,
        page: number = 1,
        limit: number = 10,
        sortDir: "asc" | "desc" = "desc",
    ): Promise<Response<RatingWithUser[]>> {
        const { skip, take } = Paginations.getPaging(page, limit);
        try {
            const ratings = await prisma.rating.findMany({
                where: { productId },
                skip,
                take,
                orderBy: { createdAt: sortDir },
                include: {
                    user: { select: { id: true, name: true, image: true } },
                },
            });
            return this.ok(ratings);
        } catch (error) {
            return this.wrapError(error, "RATING_FIND_FAILED");
        }
    }

    /** Rata-rata & jumlah rating untuk satu produk. */
    async summaryByProduct(
        productId: number,
    ): Promise<Response<RatingSummary>> {
        try {
            const agg = await prisma.rating.aggregate({
                where: { productId },
                _avg: { rating: true },
                _count: { _all: true },
            });
            return this.ok({
                productId,
                average: agg._avg.rating ?? 0,
                count: agg._count._all,
            });
        } catch (error) {
            return this.wrapError(error, "RATING_SUMMARY_FAILED");
        }
    }
}

const ratingService = new RatingService();

export default ratingService;
