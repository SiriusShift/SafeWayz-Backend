-- Truncate the ResetToken table to avoid conflicts when altering the token column
TRUNCATE TABLE "ResetToken" RESTART IDENTITY CASCADE;

-- AlterTable
ALTER TABLE "ResetToken" DROP COLUMN "token",
ADD COLUMN "token" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_token_key" ON "ResetToken"("token");

-- CreateIndex
CREATE INDEX "ResetToken_token_idx" ON "ResetToken"("token");
