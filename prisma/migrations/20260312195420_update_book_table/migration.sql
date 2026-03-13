/*
  Warnings:

  - You are about to drop the column `google_book_id` on the `books` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "books_google_book_id_key";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "google_book_id";
