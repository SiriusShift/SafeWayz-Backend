/*
  Warnings:

  - Added the required column `deviceId` to the `AccessTokens` table without a default value. This is not possible if the table is not empty.

*/

TRUNCATE TABLE "AccessTokens" RESTART IDENTITY CASCADE;

-- DropIndex
DROP INDEX "AccessTokens_userId_key";

-- AlterTable
ALTER TABLE "AccessTokens" ADD COLUMN     "deviceId" TEXT NOT NULL;
