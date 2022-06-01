/*
  Warnings:

  - You are about to drop the column `sess` on the `session` table. All the data in the column will be lost.
  - Added the required column `data` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "sess",
ADD COLUMN     "data" TEXT NOT NULL;
