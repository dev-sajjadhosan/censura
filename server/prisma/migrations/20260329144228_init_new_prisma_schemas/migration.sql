/*
  Warnings:

  - You are about to drop the column `cast` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `media_platforms` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `media_platforms` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "media_cast_idx";

-- DropIndex
DROP INDEX "media_platforms_url_idx";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "cast";

-- AlterTable
ALTER TABLE "media_platforms" DROP COLUMN "type",
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "platforms" ADD COLUMN     "type" TEXT,
ADD COLUMN     "url" TEXT;

-- CreateTable
CREATE TABLE "cast_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "cast_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cast_members" ADD CONSTRAINT "cast_members_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
