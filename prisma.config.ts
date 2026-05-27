import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  // CLI/migrasi pakai koneksi direct (port 5432). Runtime app pakai DATABASE_URL
  // (pooled/pgbouncer) lewat adapter PrismaPg di app/lib/prisma.ts.
  datasource: {
    url: env("DIRECT_URL"),
  },
});