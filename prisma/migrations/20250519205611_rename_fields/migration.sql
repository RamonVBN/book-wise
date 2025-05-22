/*
  Warnings:

  - The primary key for the `CategoriesOnBooks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `CategoriesOnBooks` table. All the data in the column will be lost.
  - You are about to drop the column `total_pages` on the `books` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `CategoriesOnBooks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPages` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoriesOnBooks" (
    "book_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    PRIMARY KEY ("book_id", "category_id"),
    CONSTRAINT "CategoriesOnBooks_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoriesOnBooks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategoriesOnBooks" ("book_id") SELECT "book_id" FROM "CategoriesOnBooks";
DROP TABLE "CategoriesOnBooks";
ALTER TABLE "new_CategoriesOnBooks" RENAME TO "CategoriesOnBooks";
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "totalPages" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_books" ("author", "cover_url", "created_at", "id", "name", "summary") SELECT "author", "cover_url", "created_at", "id", "name", "summary" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
