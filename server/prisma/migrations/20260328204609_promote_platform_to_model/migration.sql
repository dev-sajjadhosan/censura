/*
  Warnings:

  - You are about to drop the column `platform` on the `media_platforms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId,platformId]` on the table `media_platforms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `platformId` to the `media_platforms` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "media_platforms_mediaId_platform_key";

-- DropIndex
DROP INDEX "media_platforms_platform_idx";

-- AlterTable
ALTER TABLE "media_platforms" DROP COLUMN "platform",
ADD COLUMN     "platformId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Platform";

-- CreateTable
CREATE TABLE "platforms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platforms_name_key" ON "platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_slug_key" ON "platforms"("slug");

-- CreateIndex
CREATE INDEX "media_platforms_platformId_idx" ON "media_platforms"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "media_platforms_mediaId_platformId_key" ON "media_platforms"("mediaId", "platformId");

-- AddForeignKey
ALTER TABLE "media_platforms" ADD CONSTRAINT "media_platforms_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
