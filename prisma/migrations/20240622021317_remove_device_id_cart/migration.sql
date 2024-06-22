/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Cart` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Cart_deviceId_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "deviceId";
