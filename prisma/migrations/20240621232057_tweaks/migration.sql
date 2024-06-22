/*
  Warnings:

  - You are about to drop the column `desscription` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "desscription",
ADD COLUMN     "description" TEXT;
