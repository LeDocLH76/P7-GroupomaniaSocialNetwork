/*
  Warnings:

  - You are about to drop the column `comment` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `profils` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `profils` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `profils` table. All the data in the column will be lost.
  - You are about to drop the column `motDePasse` on the `users` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `profils` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `profils` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "comment",
DROP COLUMN "image",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "picture" INTEGER;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "image",
DROP COLUMN "text",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "picture" INTEGER;

-- AlterTable
ALTER TABLE "profils" DROP COLUMN "name",
DROP COLUMN "photo",
DROP COLUMN "surname",
ADD COLUMN     "firstName" VARCHAR(50) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(50) NOT NULL,
ADD COLUMN     "picture" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "motDePasse",
ADD COLUMN     "password" VARCHAR(255) NOT NULL;
