-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('MENUNGGU', 'DIPROSES', 'DIKIRIM', 'SELESAI', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "items_count" INTEGER NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'MENUNGGU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
