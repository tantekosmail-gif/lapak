import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
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

        const ext = extensionFromMime(file.type);
        const filename = `${randomUUID()}.${ext}`;
        const target = path.join(this.uploadDir, filename);

        let written = 0;
        const sizeGuard = new Transform({
            transform(chunk, _enc, cb) {
                written += chunk.byteLength;
                if (written > MAX_BYTES) {
                    cb(new Error("UPLOAD_TOO_LARGE"));
                    return;
                }
                cb(null, chunk);
            },
        });

        try {
            const source = Readable.fromWeb(file.stream() as Parameters<typeof Readable.fromWeb>[0]);
            const writeStream = createWriteStream(target, { highWaterMark: 64 * 1024 });
            await pipeline(source, sizeGuard, writeStream);

            return this.ok({
                url: `${this.publicPrefix}/${filename}`,
                filename,
                size: written,
            });
        } catch (error) {
            await unlink(target).catch(() => undefined);
            if (error instanceof Error && error.message === "UPLOAD_TOO_LARGE") {
                return this.fail("UPLOAD_TOO_LARGE", `File exceeds ${MAX_BYTES} bytes`);
            }
            return this.wrapError(error, "UPLOAD_FAILED");
        }
    }

    async deleteByUrl(url: string): Promise<Response<{ url: string }>> {
        try {
            if (!url.startsWith(`${this.publicPrefix}/`)) {
                return this.fail("UPLOAD_INVALID_URL", "URL is not managed by this storage");
            }
            const filename = path.basename(url);
            const target = path.join(this.uploadDir, filename);
            const resolved = path.resolve(target);
            if (!resolved.startsWith(path.resolve(this.uploadDir) + path.sep)) {
                return this.fail("UPLOAD_INVALID_URL", "Path traversal blocked");
            }
            await unlink(resolved).catch((err) => {
                if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
            });
            return this.ok({ url });
        } catch (error) {
            return this.wrapError(error, "UPLOAD_DELETE_FAILED");
        }
    }
}

const uploadService = new UploadService();

export default uploadService;
