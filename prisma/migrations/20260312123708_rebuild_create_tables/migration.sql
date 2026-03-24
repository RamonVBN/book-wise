/*
  Warnings:

  - You are about to drop the column `name` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `totalPages` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ratings` table. All the data in the column will be lost.
  - You are about to drop the `CategoriesOnBooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[google_book_id]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,book_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `google_book_id` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('WANT_TO_READ', 'READING', 'READ', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "CategoriesOnBooks" DROP CONSTRAINT "CategoriesOnBooks_book_id_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnBooks" DROP CONSTRAINT "CategoriesOnBooks_category_id_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_book_id_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_user_id_fkey";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "name",
DROP COLUMN "summary",
DROP COLUMN "totalPages",
ADD COLUMN     "google_book_id" TEXT NOT NULL,
ADD COLUMN     "page_count" INTEGER,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "author" DROP NOT NULL,
ALTER COLUMN "cover_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ratings" DROP COLUMN "description",
ADD COLUMN     "review" TEXT;

-- DropTable
DROP TABLE "CategoriesOnBooks";

-- DropTable
DROP TABLE "categories";

-- CreateTable
CREATE TABLE "user_books" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'WANT_TO_READ',
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "current_page" INTEGER,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_books_user_id_book_id_key" ON "user_books"("user_id", "book_id");

-- CreateIndex
CREATE UNIQUE INDEX "books_google_book_id_key" ON "books"("google_book_id");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_user_id_book_id_key" ON "ratings"("user_id", "book_id");

-- AddForeignKey
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
