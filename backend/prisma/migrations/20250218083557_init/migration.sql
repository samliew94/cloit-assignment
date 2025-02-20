/*
  Warnings:

  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Menu";

-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "parentId" UUID,
    "groupId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menu_parentId_key" ON "menu"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "menu_groupId_key" ON "menu"("groupId");
