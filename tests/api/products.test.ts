import "@/tests/mocks/prisma";
import "@/tests/mocks/google-auth";

import { NextRequest } from "next/server";
import { prismaMock } from "@/tests/mocks/prisma";
import { GET } from "@/app/api/public/products/route";
import { GET as GET_BY_ID } from "@/app/api/public/products/[id]/route";
import { POST as POST_SAVE } from "@/app/api/(auth)/products/save/route";
import { POST as POST_SAVE_ALL } from "@/app/api/(auth)/products/saveAll/route";
import { PUT } from "@/app/api/(auth)/products/[id]/update/route";
import { DELETE } from "@/app/api/(auth)/products/[id]/delete/route";

const buildRequest = (search = "") =>
    new NextRequest(`http://localhost:3000/api/public/products${search}`);

const buildBodyRequest = (body: any, path = "", method = "POST") =>
    new NextRequest(`http://localhost:3000/api/products${path}`, {
        method,
        body: JSON.stringify(body),
    });

const sampleProducts = [
    {
        id: 1,
        name: "Kopi Susu",
        price: 15000,
        regular_price: 20000,
        stock: 10,
        sold: 0,
        imageUrl: null,
        status: "AKTIF",
        slug: "kopi-susu",
        categoryId: 1,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
    },
    {
        id: 2,
        name: "Teh Manis",
        price: 5000,
        regular_price: 7000,
        stock: 20,
        sold: 0,
        imageUrl: null,
        status: "AKTIF",
        slug: "teh-manis",
        categoryId: 1,
        createdAt: new Date("2026-01-02T00:00:00Z"),
        updatedAt: new Date("2026-01-02T00:00:00Z"),
    },
];

describe("GET /api/public/products", () => {
    it("returns the paginated products with default page=1, limit=10", async () => {
        prismaMock.product.findMany.mockResolvedValue(sampleProducts);

        const response = await GET(buildRequest("?sort=createdAt"));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toHaveLength(2);
        expect(body.data[0]).toMatchObject({ id: 1, slug: "kopi-susu" });

        expect(prismaMock.product.findMany).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
            where: undefined,
            orderBy: { createdAt: "ASC" },
        });
    });

    it("applies pagination and descending sort", async () => {
        prismaMock.product.findMany.mockResolvedValue([sampleProducts[1]]);

        const response = await GET(buildRequest("?page=2&limit=5&sort=-name"));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(prismaMock.product.findMany).toHaveBeenCalledWith({
            skip: 5,
            take: 5,
            where: undefined,
            orderBy: { name: "DESC" },
        });
    });

    it("filters by search keyword", async () => {
        prismaMock.product.findMany.mockResolvedValue([sampleProducts[0]]);

        const response = await GET(buildRequest("?search=kopi&sort=createdAt"));

        expect(response.status).toBe(200);
        expect(prismaMock.product.findMany).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
            where: { name: { contains: "kopi" } },
            orderBy: { createdAt: "ASC" },
        });
    });

    it("wraps repository errors as failed Response", async () => {
        prismaMock.product.findMany.mockRejectedValue(new Error("db down"));

        const response = await GET(buildRequest("?sort=createdAt"));
        const body = await response.json();

        expect(body.success).toBe(false);
        expect(body.error).toEqual(
            expect.objectContaining({
                code: "PRODUCT_FIND_FAILED",
                message: "db down",
            }),
        );
    });
});

describe("GET /api/public/products/[id]", () => {
    it("returns the product when it exists", async () => {
        prismaMock.product.findFirst.mockResolvedValue(sampleProducts[0]);

        const response = await GET_BY_ID({} as any, { params: Promise.resolve({ id: "1" }) } as any);

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({ id: 1, name: "Kopi Susu" });
    });

    it("returns 404 when product not found", async () => {
        prismaMock.product.findFirst.mockResolvedValue(null);

        const response = await GET_BY_ID({} as any, { params: Promise.resolve({ id: "99" }) } as any);

        expect(response.status).toBe(404);
    });
});

describe("POST /api/products/save", () => {
    it("creates a product", async () => {
        prismaMock.product.create.mockResolvedValue(sampleProducts[0]);

        const response = await POST_SAVE(
            buildBodyRequest({
                name: "Kopi Susu",
                price: 15000,
                regular_price: 20000,
                stock: 10,
            }),
        );

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(prismaMock.product.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                name: "Kopi Susu",
                price: 15000,
                stock: 10,
                slug: "kopi-susu",
            }),
        });
    });

    it("fails validation when payload is invalid", async () => {
        const response = await POST_SAVE(
            buildBodyRequest({ name: "", price: -1 }),
        );

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error.code).toBe("PRODUCT_VALIDATION_FAILED");
        expect(prismaMock.product.create).not.toHaveBeenCalled();
    });
});

describe("POST /api/products/saveAll", () => {
    it("creates category and product in a transaction", async () => {
        const newCategory = { id: 7, name: "Minuman", image: null, createdAt: new Date() };
        const newProduct = { ...sampleProducts[0], categoryId: 7 };

        const tx = {
            productCategories: { create: jest.fn().mockResolvedValue(newCategory) },
            product: { create: jest.fn().mockResolvedValue(newProduct) },
        };
        prismaMock.$transaction.mockImplementation(async (cb: any) => cb(tx));

        const response = await POST_SAVE_ALL(
            buildBodyRequest({
                category: { name: "Minuman" },
                product: { name: "Kopi Susu", price: 15000, regular_price: 20000, stock: 10 },
            }),
        );

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(tx.productCategories.create).toHaveBeenCalledWith({
            data: { name: "Minuman", image: undefined },
        });
        expect(tx.product.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                name: "Kopi Susu",
                price: 15000,
                slug: "kopi-susu",
                category: { connect: { id: 7 } },
            }),
        });
    });

    it("returns 400 on validation error", async () => {
        const response = await POST_SAVE_ALL(
            buildBodyRequest({ category: {}, product: {} }),
        );

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.error.code).toBe("PRODUCT_VALIDATION_FAILED");
    });
});

describe("PUT /api/products/[id]/update", () => {
    it("updates an existing product", async () => {
        prismaMock.product.findFirst.mockResolvedValue(sampleProducts[0]);
        prismaMock.product.update.mockResolvedValue({
            ...sampleProducts[0],
            price: 20000,
        });

        const response = await PUT(
            buildBodyRequest({ price: 20000 }, "/1/update", "PUT"),
            { params: Promise.resolve({ id: "1" }) } as any,
        );

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data.price).toBe(20000);
    });

    it("returns 404 when product missing", async () => {
        prismaMock.product.findFirst.mockResolvedValue(null);

        const response = await PUT(
            buildBodyRequest({ price: 20000 }, "/99/update", "PUT"),
            { params: Promise.resolve({ id: "99" }) } as any,
        );

        expect(response.status).toBe(404);
    });
});

describe("DELETE /api/products/[id]/delete", () => {
    it("deletes an existing product", async () => {
        prismaMock.product.findFirst.mockResolvedValue(sampleProducts[0]);
        prismaMock.product.delete.mockResolvedValue(sampleProducts[0]);

        const response = await DELETE({} as any, { params: Promise.resolve({ id: "1" }) } as any);

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({ id: 1 });
    });

    it("returns 404 when product not found", async () => {
        prismaMock.product.findFirst.mockResolvedValue(null);

        const response = await DELETE({} as any, { params: Promise.resolve({ id: "99" }) } as any);

        expect(response.status).toBe(404);
    });
});
