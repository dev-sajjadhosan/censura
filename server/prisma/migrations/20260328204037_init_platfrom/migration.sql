/*
  Warnings:

  - Added the required column `type` to the `media_platforms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PurchaseType" AS ENUM ('BUY', 'RENT');

-- AlterTable
ALTER TABLE "media_platforms" ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "media_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "PurchaseType" NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_purchases_userId_idx" ON "media_purchases"("userId");

-- CreateIndex
CREATE INDEX "media_purchases_mediaId_idx" ON "media_purchases"("mediaId");

-- AddForeignKey
ALTER TABLE "media_purchases" ADD CONSTRAINT "media_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_purchases" ADD CONSTRAINT "media_purchases_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
