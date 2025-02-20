/*
  Warnings:

  - You are about to drop the column `groupId` on the `menu` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "menu_groupId_key";

-- AlterTable
ALTER TABLE "menu" DROP COLUMN "groupId";
