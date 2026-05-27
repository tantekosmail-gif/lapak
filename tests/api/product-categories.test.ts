import "@/tests/mocks/prisma";
import "@/tests/mocks/google-auth";

import { NextRequest } from "next/server";
import { prismaMock } from "@/tests/mocks/prisma";
import { GET, POST } from "@/app/api/(auth)/product-categories/route";
import { DELETE, GET as GET_BY_ID, PUT } from "@/app/api/(auth)/product-categories/[id]/route";

const buildRequest = (search = "") =>
    new NextRequest(`http://localhost:3000/api/product-categories${search}`);

const buildPostRequest = (body: any, id?: number, method = "POST") =>
    new NextRequest(`http://localhost:3000/api/product-categories${id ? `/${id}` : ""}`, {
        method: method,
        body: JSON.stringify(body),
    });

const sampleCategories = [
    {
        id: 1,
        name: "Makanan",
        slug: "makanan",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
    },
    {
        id: 2,
        name: "Minuman",
        slug: "minuman",
        createdAt: new Date("2026-01-02T00:00:00Z"),
        updatedAt: new Date("2026-01-02T00:00:00Z"),
    },
];

describe("GET /api/product-categories", () => {
    it("returns the paginated categories with default page=1, limit=10", async () => {
        prismaMock.productCategories.findMany.mockResolvedValue(sampleCategories);

        const response = await GET(buildRequest("?sort=createdAt"));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toHaveLength(2);
        expect(body.data[0]).toMatchObject({ id: 1, slug: "makanan" });

        expect(prismaMock.productCategories.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.productCategories.findMany).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
            orderBy: { createdAt: "ASC" },
        });
    });

    it("translates page, limit and descending sort into the prisma query", async () => {
        prismaMock.productCategories.findMany.mockResolvedValue([sampleCategories[1]]);

        const response = await GET(buildRequest("?page=3&limit=5&sort=-name"));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toEqual([
            expect.objectContaining({ id: 2, name: "Minuman" }),
        ]);

        expect(prismaMock.productCategories.findMany).toHaveBeenCalledWith({
            skip: 10,
            take: 5,
            orderBy: { name: "DESC" },
        });
    });

    it("returns an empty list when no categories exist", async () => {
        prismaMock.productCategories.findMany.mockResolvedValue([]);

        const response = await GET(buildRequest("?sort=createdAt"));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toEqual([]);
    });

    it("wraps repository errors as a failed Response payload", async () => {
        prismaMock.productCategories.findMany.mockRejectedValue(
            new Error("db unreachable"),
        );

        const response = await GET(buildRequest("?sort=createdAt"));

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error).toEqual(
            expect.objectContaining({
                code: "PRODUCT_CATEGORY_FIND_FAILED",
                message: "db unreachable",
            }),
        );
    });

    it("can create categories", async () => {
        const category = {
            name: "Makanan",
            image: "makanan.jpg",
        };
        const response = await POST(buildPostRequest(category));
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
    });

    it("can find category by id", async () => {
        prismaMock.productCategories.findFirst.mockResolvedValue({
            id: 1,
            name: "a",
            image: "a.jpg",
        });
        const prism = Promise.resolve({ id: "1" })
        const response = await GET_BY_ID({} as any, { params: prism } as any);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toEqual({
            id: 1,
            name: "a",
            image: "a.jpg",
        });
    });

    it("can update category by id", async () => {
        prismaMock.productCategories.findFirst.mockResolvedValue({
            id: 1,
            name: "c",
            image: "a.jpg",
        });
        prismaMock.productCategories.update.mockResolvedValue({
            id: 1,
            name: "a",
            image: "a.jpg",
        });
        const prism = Promise.resolve({ id: "1" })
        const requestBody = {
            name: "a",
            image: "a.jpg",
        };
        const response = await PUT(buildPostRequest(requestBody, 1, "PUT"), { params: prism } as any);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toEqual({
            id: 1,
            name: "a",
            image: "a.jpg",
        });
    });

    it("can delete category by id", async () => {
        prismaMock.productCategories.delete.mockResolvedValue({
            id: 1,
            name: "a",
            image: "a.jpg",
        });
        const prism = Promise.resolve({ id: "1" })
        const response = await DELETE({} as any, { params: prism } as any);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toEqual({
            id: 1,
            name: "a",
            image: "a.jpg",
        });
    });
});
