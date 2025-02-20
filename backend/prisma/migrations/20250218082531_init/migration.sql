/*
  Warnings:

  - The `parentId` column on the `Menu` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `groupId` on the `Menu` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "parentId",
ADD COLUMN     "parentId" UUID,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_parentId_key" ON "Menu"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_groupId_key" ON "Menu"("groupId");
