/*
  Warnings:

  - You are about to drop the `ResetToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_userId_fkey";

-- AlterTable
ALTER TABLE "Reports" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ResetToken";

-- CreateTable
CREATE TABLE "ResetTokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResetTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetTokens_token_key" ON "ResetTokens"("token");

-- CreateIndex
CREATE INDEX "ResetTokens_userId_idx" ON "ResetTokens"("userId");

-- CreateIndex
CREATE INDEX "ResetTokens_token_idx" ON "ResetTokens"("token");

-- AddForeignKey
ALTER TABLE "ResetTokens" ADD CONSTRAINT "ResetTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
