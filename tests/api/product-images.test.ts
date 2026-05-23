import "@/tests/mocks/prisma";

import { NextRequest } from "next/server";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { prismaMock } from "@/tests/mocks/prisma";

jest.mock("@/modules/services/UploadService", () => {
    const fs = jest.requireActual("node:fs");
    const os = jest.requireActual("node:os");
    const p = jest.requireActual("node:path");
    const actual = jest.requireActual("@/modules/services/UploadService");
    const tempDir = fs.mkdtempSync(p.join(os.tmpdir(), "pimg-test-"));
    const instance = new actual.UploadService(tempDir, "/uploads");
    return {
        __esModule: true,
        UploadService: actual.UploadService,
        default: instance,
        __tempDir: tempDir,
    };
});

const uploadModule = jest.requireMock("@/modules/services/UploadService") as {
    __tempDir: string;
};

const { POST: ATTACH } = require("@/app/api/(auth)/products/images/attach/route");
const { POST: DETACH } = require("@/app/api/(auth)/products/images/detach/route");

afterAll(() => {
    rmSync(uploadModule.__tempDir, { recursive: true, force: true });
});

const buildFormRequest = (formData: FormData) =>
    new NextRequest("http://localhost:3000/api/products/images/attach", {
        method: "POST",
        body: formData,
    });

const buildJsonRequest = (body: any) =>
    new NextRequest("http://localhost:3000/api/products/images/detach", {
        method: "POST",
        body: JSON.stringify(body),
    });

const productRow = {
    id: 5,
    name: "Kopi",
    price: 10000,
    stock: 0,
    sold: 0,
    imageUrl: null,
    status: "AKTIF",
    slug: "kopi",
    categoryId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("POST /api/products/images/attach", () => {
    it("uploads files and creates ProductImage rows", async () => {
        prismaMock.product.findFirst.mockResolvedValue(productRow);
        let nextId = 100;
        prismaMock.productImage.create.mockImplementation(async ({ data }: any) => ({
            id: nextId++,
            url: data.url,
            sortOrder: data.sortOrder,
            isPrimary: data.isPrimary,
            productId: productRow.id,
            createdAt: new Date(),
        }));

        const form = new FormData();
        form.append("productId", "5");
        form.append("isPrimary", "true");
        form.append("file", new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" }), "a.png");
        form.append("file", new Blob([new Uint8Array([4, 5, 6, 7])], { type: "image/jpeg" }), "b.jpg");

        const response = await ATTACH(buildFormRequest(form));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data).toHaveLength(2);
        expect(body.data[0].isPrimary).toBe(true);
        expect(body.data[1].isPrimary).toBe(false);
        expect(body.data[0].sortOrder).toBe(0);
        expect(body.data[1].sortOrder).toBe(1);

        const files = readdirSync(uploadModule.__tempDir);
        expect(files.filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))).toHaveLength(2);
    });

    it("rejects when product is missing", async () => {
        prismaMock.product.findFirst.mockResolvedValue(null);

        const form = new FormData();
        form.append("productId", "999");
        form.append("file", new Blob([new Uint8Array([1])], { type: "image/png" }), "x.png");

        const response = await ATTACH(buildFormRequest(form));

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.error.code).toBe("PRODUCT_NOT_FOUND");
        expect(prismaMock.productImage.create).not.toHaveBeenCalled();
    });

    it("rolls back uploaded files when DB insert fails", async () => {
        prismaMock.product.findFirst.mockResolvedValue(productRow);
        prismaMock.productImage.create.mockRejectedValue(new Error("db boom"));

        const form = new FormData();
        form.append("productId", "5");
        form.append("file", new Blob([new Uint8Array([9, 9, 9])], { type: "image/png" }), "fail.png");

        const startFiles = new Set(readdirSync(uploadModule.__tempDir));
        const response = await ATTACH(buildFormRequest(form));

        expect(response.status).toBe(400);
        const after = readdirSync(uploadModule.__tempDir).filter((f) => !startFiles.has(f));
        expect(after).toHaveLength(0);
    });

    it("returns 400 when no productId is provided", async () => {
        const form = new FormData();
        form.append("file", new Blob([new Uint8Array([1])], { type: "image/png" }), "x.png");

        const response = await ATTACH(buildFormRequest(form));
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error.code).toBe("PRODUCT_IMAGE_VALIDATION_FAILED");
    });
});

describe("POST /api/products/images/detach", () => {
    it("deletes image records and removes files from storage", async () => {
        const fs = require("node:fs");
        const p = require("node:path");
        const filenameA = "to-delete-a.png";
        const filenameB = "to-delete-b.png";
        fs.writeFileSync(p.join(uploadModule.__tempDir, filenameA), Buffer.from([1]));
        fs.writeFileSync(p.join(uploadModule.__tempDir, filenameB), Buffer.from([2]));

        prismaMock.productImage.findMany.mockResolvedValue([
            { id: 11, url: `/uploads/${filenameA}`, productId: 5, sortOrder: 0, isPrimary: false, createdAt: new Date() },
            { id: 12, url: `/uploads/${filenameB}`, productId: 5, sortOrder: 1, isPrimary: false, createdAt: new Date() },
        ]);
        prismaMock.productImage.delete.mockResolvedValue({});

        const response = await DETACH(buildJsonRequest({ ids: [11, 12] }));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.data.deleted).toEqual([11, 12]);

        expect(existsSync(p.join(uploadModule.__tempDir, filenameA))).toBe(false);
        expect(existsSync(p.join(uploadModule.__tempDir, filenameB))).toBe(false);
    });

    it("returns failure when no images match", async () => {
        prismaMock.productImage.findMany.mockResolvedValue([]);

        const response = await DETACH(buildJsonRequest({ ids: [999] }));

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.error.code).toBe("PRODUCT_IMAGE_NOT_FOUND");
    });

    it("validates payload shape", async () => {
        const response = await DETACH(buildJsonRequest({ ids: [] }));
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.error.code).toBe("PRODUCT_IMAGE_VALIDATION_FAILED");
    });
});
