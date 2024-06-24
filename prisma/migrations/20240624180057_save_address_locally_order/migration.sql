/*
  Warnings:

  - You are about to drop the column `addressId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_addressId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "addressId",
ADD COLUMN     "address_city" TEXT,
ADD COLUMN     "address_country" TEXT,
ADD COLUMN     "address_street" TEXT;
