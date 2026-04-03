/*
  Warnings:

  - Added the required column `updated_at` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
