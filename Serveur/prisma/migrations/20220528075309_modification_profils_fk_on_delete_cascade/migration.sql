-- DropForeignKey
ALTER TABLE "profils" DROP CONSTRAINT "profils_userId_fkey";

-- AddForeignKey
ALTER TABLE "profils" ADD CONSTRAINT "profils_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
