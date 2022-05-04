/*
  Warnings:

  - You are about to drop the column `respawn` on the `RaidBosses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RaidBosses" DROP COLUMN "respawn",
ADD COLUMN     "respawnEnd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "respawnStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
