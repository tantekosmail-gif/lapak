import { Prisma } from "@/app/generated/prisma/client";
import { BaseRepository } from "../core";
import type { RatingEntity } from "../entities/Rating";
import { prisma } from "@/app/lib/prisma";

export class RatingRepository extends BaseRepository<
    RatingEntity,
    Prisma.RatingWhereUniqueInput,
    Prisma.RatingWhereInput,
    Prisma.RatingCreateInput,
    Prisma.RatingUpdateInput
> {
    constructor() {
        super(prisma.rating);
    }
}

export const ratingRepository = new RatingRepository();
