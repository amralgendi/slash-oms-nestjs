/*
  Warnings:

  - The primary key for the `CartItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY ("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_key" ON "CartItem"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_productId_key" ON "CartItem"("productId");
