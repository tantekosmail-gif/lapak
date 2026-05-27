/*
  Warnings:

  - You are about to drop the column `customer` on the `orders` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserTypeEnum" AS ENUM ('CUSTOMER', 'ADMIN');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customer",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "user_type" "UserTypeEnum" NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE "store_configuraions" (
    "id" SERIAL NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "store_configuraions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
