-- AlterTable: add regular_price. Backfill existing rows from price, then enforce NOT NULL.
ALTER TABLE "products" ADD COLUMN "regular_price" INTEGER;
UPDATE "products" SET "regular_price" = "price" WHERE "regular_price" IS NULL;
ALTER TABLE "products" ALTER COLUMN "regular_price" SET NOT NULL;
