import { prisma } from "@/app/lib/prisma";
import { BaseService, Response } from "../core";
import {
    addToCartSchema,
    updateCartItemSchema,
    type AddToCartDto,
    type UpdateCartItemDto,
} from "../dto/Cart.dto";
import type { CartLine } from "../entities/Cart";
import {
    cartRepository,
    CartRepository,
} from "../repositories/CartRepository";

export class CartService extends BaseService<CartRepository> {
    constructor(repository: CartRepository = cartRepository) {
        super(repository);
    }

    /** Semua entri cart milik customer ini (urut terbaru di atas). */
    async list(customerId: number): Promise<Response<CartLine[]>> {
        try {
            const items = await prisma.cart.findMany({
                where: { customerId },
                include: { product: true },
                orderBy: { createdAt: "desc" },
            });
            return this.ok(items);
        } catch (error) {
            return this.wrapError(error, "CART_FIND_FAILED");
        }
    }

    /**
     * Tambah produk ke cart customer. Idempotent pada `(customerId, productId)`:
     * panggilan ulang **menambah qty** alih-alih duplikat — perilaku standar
     * "Tambah ke Keranjang" pada toko online.
     */
    async add(
        customerId: number,
        body: AddToCartDto,
    ): Promise<Response<CartLine>> {
        const parsed = addToCartSchema.safeParse(body);
        if (!parsed.success) {
            return this.fail(
                "CART_VALIDATION_FAILED",
                "Invalid cart payload",
                parsed.error.issues,
            );
        }
        try {
            const product = await prisma.product.findUnique({
                where: { id: parsed.data.productId },
            });
            if (!product) {
                return this.fail(
                    "PRODUCT_NOT_FOUND",
                    `Product ${parsed.data.productId} not found`,
                );
            }
            const line = await prisma.cart.upsert({
                where: {
                    customerId_productId: {
                        customerId,
                        productId: parsed.data.productId,
                    },
                },
                create: {
                    customerId,
                    productId: parsed.data.productId,
                    qty: parsed.data.qty,
                },
                update: { qty: { increment: parsed.data.qty } },
                include: { product: true },
            });
            return this.ok(line);
        } catch (error) {
            return this.wrapError(error, "CART_ADD_FAILED");
        }
    }

    /**
     * Set qty entri cart **secara absolut**. Bila `qty <= 0` entri di-hapus
     * (best-effort; tidak error jika tidak ada).
     */
    async setQuantity(
        customerId: number,
        productId: number,
        body: UpdateCartItemDto,
    ): Promise<Response<CartLine | { removed: true }>> {
        const parsed = updateCartItemSchema.safeParse(body);
        if (!parsed.success) {
            return this.fail(
                "CART_VALIDATION_FAILED",
                "Invalid cart payload",
                parsed.error.issues,
            );
        }
        try {
            if (parsed.data.qty <= 0) {
                await prisma.cart.deleteMany({ where: { customerId, productId } });
                return this.ok({ removed: true });
            }
            const line = await prisma.cart.upsert({
                where: { customerId_productId: { customerId, productId } },
                create: { customerId, productId, qty: parsed.data.qty },
                update: { qty: parsed.data.qty },
                include: { product: true },
            });
            return this.ok(line);
        } catch (error) {
            return this.wrapError(error, "CART_UPDATE_FAILED");
        }
    }

    /** Hapus satu entri (best-effort). */
    async remove(
        customerId: number,
        productId: number,
    ): Promise<Response<{ removed: true }>> {
        try {
            await prisma.cart.deleteMany({ where: { customerId, productId } });
            return this.ok({ removed: true });
        } catch (error) {
            return this.wrapError(error, "CART_REMOVE_FAILED");
        }
    }

    /** Kosongkan seluruh cart customer. */
    async clear(customerId: number): Promise<Response<{ cleared: true }>> {
        try {
            await prisma.cart.deleteMany({ where: { customerId } });
            return this.ok({ cleared: true });
        } catch (error) {
            return this.wrapError(error, "CART_CLEAR_FAILED");
        }
    }
}

const cartService = new CartService();

export default cartService;
