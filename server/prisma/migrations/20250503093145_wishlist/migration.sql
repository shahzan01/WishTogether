/*
  Warnings:

  - You are about to drop the column `addedAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `addedBy` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `editedAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `editedBy` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_wishlistId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "addedAt",
DROP COLUMN "addedBy",
DROP COLUMN "editedAt",
DROP COLUMN "editedBy",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "isArchived",
DROP COLUMN "publicKey",
ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Item_wishlistId_idx" ON "Item"("wishlistId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_publicId_key" ON "Wishlist"("publicId");

-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "Wishlist"("userId");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
