-- CreateTable
CREATE TABLE "WishlistCollaborator" (
    "id" TEXT NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WishlistCollaborator_wishlistId_idx" ON "WishlistCollaborator"("wishlistId");

-- CreateIndex
CREATE INDEX "WishlistCollaborator_userId_idx" ON "WishlistCollaborator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistCollaborator_wishlistId_userId_key" ON "WishlistCollaborator"("wishlistId", "userId");

-- AddForeignKey
ALTER TABLE "WishlistCollaborator" ADD CONSTRAINT "WishlistCollaborator_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistCollaborator" ADD CONSTRAINT "WishlistCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
