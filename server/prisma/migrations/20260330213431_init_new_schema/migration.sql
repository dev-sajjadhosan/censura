/*
  Warnings:

  - You are about to drop the column `amount` on the `media_purchases` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `media_purchases` table. All the data in the column will be lost.
  - The `type` column on the `media_purchases` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,mediaId,type]` on the table `media_purchases` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `price` to the `media_purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `media_purchases` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MediaPurchaseType" AS ENUM ('RENTAL', 'BUY');

-- CreateEnum
CREATE TYPE "MediaPurchaseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "media_purchases" DROP CONSTRAINT "media_purchases_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "media_purchases" DROP CONSTRAINT "media_purchases_userId_fkey";

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "buyPrice" DECIMAL(10,2),
ADD COLUMN     "rentalPrice" DECIMAL(10,2),
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "media_purchases" DROP COLUMN "amount",
DROP COLUMN "expiryDate",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "status" "MediaPurchaseStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "stripePaymentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "MediaPurchaseType" NOT NULL DEFAULT 'RENTAL';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "rentalId" TEXT;

-- CreateTable
CREATE TABLE "rentals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rentals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rentals_userId_idx" ON "rentals"("userId");

-- CreateIndex
CREATE INDEX "rentals_mediaId_idx" ON "rentals"("mediaId");

-- CreateIndex
CREATE INDEX "rentals_expiresAt_idx" ON "rentals"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "rentals_userId_mediaId_key" ON "rentals"("userId", "mediaId");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_purchases_expiresAt_idx" ON "media_purchases"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "media_purchases_userId_mediaId_type_key" ON "media_purchases"("userId", "mediaId", "type");

-- AddForeignKey
ALTER TABLE "media_purchases" ADD CONSTRAINT "media_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_purchases" ADD CONSTRAINT "media_purchases_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_purchases" ADD CONSTRAINT "media_purchases_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "rentals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
