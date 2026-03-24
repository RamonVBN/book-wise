/*
  Warnings:

  - Added the required column `categories` to the `books` table without a default value. This is not possible if the table is not empty.
  - Made the column `author` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cover_url` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `page_count` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `books` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "categories" TEXT NOT NULL,
ALTER COLUMN "author" SET NOT NULL,
ALTER COLUMN "cover_url" SET NOT NULL,
ALTER COLUMN "page_count" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL;
