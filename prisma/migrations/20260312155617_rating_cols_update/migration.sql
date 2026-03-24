/*
  Warnings:

  - Made the column `review` on table `ratings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ratings" ALTER COLUMN "review" SET NOT NULL;
