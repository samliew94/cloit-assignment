-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_parentId_key" ON "Menu"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_groupId_key" ON "Menu"("groupId");
