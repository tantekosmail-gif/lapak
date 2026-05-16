/*
  Warnings:

  - You are about to drop the column `token_expired_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "token_expired_at";
