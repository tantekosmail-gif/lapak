import { POST } from "@/app/api/(auth)/upload/route";
import { NextRequest } from "next/server";
import { readdirSync, rmSync } from "node:fs";

jest.mock("@/modules/services/UploadService", () => {
    const fs = jest.requireActual("node:fs");
    const os = jest.requireActual("node:os");
    const p = jest.requireActual("node:path");
    const { UploadService } = jest.requireActual("@/modules/services/UploadService");
    const tempDir = fs.mkdtempSync(p.join(os.tmpdir(), "upload-test-"));
    return {
        __esModule: true,
        default: new UploadService(tempDir, "/uploads"),
        __tempDir: tempDir,
    };
});

const uploadModule = jest.requireMock("@/modules/services/UploadService") as {
    __tempDir: string;
};

afterAll(() => {
    rmSync(uploadModule.__tempDir, { recursive: true, force: true });
});

const buildRequest = (formData: FormData) =>
    new NextRequest("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
    });

describe("POST /api/upload", () => {
    it("saves the file and returns a public URL", async () => {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array([1, 2, 3, 4])], { type: "image/png" });
        formData.append("file", blob, "test.png");

        const response = await POST(buildRequest(formData));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.data.url).toMatch(/^\/uploads\/.+\.png$/);
        expect(body.data.size).toBe(4);

        const written = readdirSync(uploadModule.__tempDir);
        expect(written.some((f) => f.endsWith(".png"))).toBe(true);
    });

    it("rejects when no file is provided", async () => {
        const formData = new FormData();
        const response = await POST(buildRequest(formData));

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error.code).toBe("UPLOAD_NO_FILE");
    });

    it("rejects unsupported MIME types", async () => {
        const formData = new FormData();
        const blob = new Blob(["hello"], { type: "text/plain" });
        formData.append("file", blob, "hi.txt");

        const response = await POST(buildRequest(formData));

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error.code).toBe("UPLOAD_INVALID_TYPE");
    });
});
