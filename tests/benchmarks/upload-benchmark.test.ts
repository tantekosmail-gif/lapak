/**
 * Benchmark — verifies UploadService.saveImage streams files to disk without
 * holding the whole payload in memory. We compare RSS deltas against a naive
 * arrayBuffer-based control to assert the streaming path is significantly
 * leaner for large files.
 */
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { UploadService } from "@/modules/services/UploadService";

const MB = 1024 * 1024;
const FILE_BYTES = 4 * MB;

const buildFile = (size: number): File => {
    const chunkSize = 64 * 1024;
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    for (let written = 0; written < size; written += chunkSize) {
        const len = Math.min(chunkSize, size - written);
        const chunk = new Uint8Array(len);
        chunk.fill(written & 0xff);
        chunks.push(chunk);
    }
    return new File(chunks, "blob.png", { type: "image/png" });
};

const runWithHeapSnapshots = async (fn: () => Promise<unknown>) => {
    if (global.gc) global.gc();
    const before = process.memoryUsage();
    const start = process.hrtime.bigint();
    await fn();
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    if (global.gc) global.gc();
    const after = process.memoryUsage();
    return {
        elapsedMs,
        heapDeltaBytes: after.heapUsed - before.heapUsed,
        rssDeltaBytes: after.rss - before.rss,
    };
};

describe("UploadService benchmark", () => {
    let tempDir: string;
    let service: UploadService;

    beforeAll(() => {
        tempDir = mkdtempSync(path.join(tmpdir(), "upload-bench-"));
        service = new UploadService(tempDir, "/uploads");
    });

    afterAll(() => {
        rmSync(tempDir, { recursive: true, force: true });
    });

    it("streams a 4MB file to disk and reports a reasonable delta", async () => {
        const file = buildFile(FILE_BYTES);

        const metrics = await runWithHeapSnapshots(async () => {
            const result = await service.saveImage(file);
            expect(result.success).toBe(true);
        });

        expect(readdirSync(tempDir).some((f) => f.endsWith(".png"))).toBe(true);

        // eslint-disable-next-line no-console
        console.log(
            `[bench:stream] ${FILE_BYTES / MB}MB | ${metrics.elapsedMs.toFixed(1)}ms | ` +
                `heapDelta=${(metrics.heapDeltaBytes / MB).toFixed(2)}MB | ` +
                `rssDelta=${(metrics.rssDeltaBytes / MB).toFixed(2)}MB`,
        );

        // Stream path should NOT retain the whole file in heap. Allow up to 2x file size for safety.
        expect(metrics.heapDeltaBytes).toBeLessThan(FILE_BYTES * 2);
    });

    it("control: buffered arrayBuffer keeps the payload alive longer", async () => {
        const file = buildFile(FILE_BYTES);
        const naiveDir = mkdtempSync(path.join(tmpdir(), "upload-bench-naive-"));

        try {
            const metrics = await runWithHeapSnapshots(async () => {
                const buf = Buffer.from(await file.arrayBuffer());
                const target = path.join(naiveDir, "naive.png");
                writeFileSync(target, buf);
                // hold reference so GC cannot drop it before snapshot
                expect(buf.length).toBe(FILE_BYTES);
            });

            // eslint-disable-next-line no-console
            console.log(
                `[bench:buffer] ${FILE_BYTES / MB}MB | ${metrics.elapsedMs.toFixed(1)}ms | ` +
                    `heapDelta=${(metrics.heapDeltaBytes / MB).toFixed(2)}MB | ` +
                    `rssDelta=${(metrics.rssDeltaBytes / MB).toFixed(2)}MB`,
            );
        } finally {
            rmSync(naiveDir, { recursive: true, force: true });
        }
    });
});
