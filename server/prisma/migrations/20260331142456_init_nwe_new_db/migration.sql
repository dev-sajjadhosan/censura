-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_commentId_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_reviewId_fkey";

-- DropIndex
DROP INDEX "review_userId_mediaId_key";

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
