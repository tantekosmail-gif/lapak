import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { BaseResponse, Response } from "../core";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

const extensionFromMime = (mime: string) => {
    switch (mime) {
        case "image/jpeg":
            return "jpg";
        case "image/png":
            return "png";
        case "image/webp":
            return "webp";
        case "image/gif":
            return "gif";
        default:
            return "bin";
    }
};

export type UploadResult = { url: string; filename: string; size: number };

export class UploadService extends BaseResponse {
    constructor(
        private readonly uploadDir: string = path.join(process.cwd(), "public", "uploads"),
        private readonly publicPrefix: string = "/uploads",
    ) {
        super();
    }

    async saveImage(file: File): Promise<Response<UploadResult>> {
        if (!file || typeof file === "string") {
            return this.fail("UPLOAD_NO_FILE", "No file provided");
        }
        if (!ALLOWED_MIME.has(file.type)) {
            return this.fail("UPLOAD_INVALID_TYPE", `Unsupported file type: ${file.type}`);
        }
        if (file.size > MAX_BYTES) {
            return this.fail("UPLOAD_TOO_LARGE", `File exceeds ${MAX_BYTES} bytes`);
        }
        try {
            const ext = extensionFromMime(file.type);
            const filename = `${randomUUID()}.${ext}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(path.join(this.uploadDir, filename), buffer);
            return this.ok({
                url: `${this.publicPrefix}/${filename}`,
                filename,
                size: file.size,
            });
        } catch (error) {
            return this.wrapError(error, "UPLOAD_FAILED");
        }
    }
}

const uploadService = new UploadService();

export default uploadService;
