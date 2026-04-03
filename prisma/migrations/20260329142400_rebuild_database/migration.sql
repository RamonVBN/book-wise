/*
  Warnings:

  - The values [READ] on the enum `ReadingStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updated_at` to the `user_books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReadingStatus_new" AS ENUM ('WANT_TO_READ', 'READING', 'FINISHED', 'ABANDONED');
ALTER TABLE "user_books" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user_books" ALTER COLUMN "status" TYPE "ReadingStatus_new" USING ("status"::text::"ReadingStatus_new");
ALTER TYPE "ReadingStatus" RENAME TO "ReadingStatus_old";
ALTER TYPE "ReadingStatus_new" RENAME TO "ReadingStatus";
DROP TYPE "ReadingStatus_old";
ALTER TABLE "user_books" ALTER COLUMN "status" SET DEFAULT 'WANT_TO_READ';
COMMIT;

-- AlterTable
ALTER TABLE "user_books" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "user_books_user_id_status_idx" ON "user_books"("user_id", "status");
