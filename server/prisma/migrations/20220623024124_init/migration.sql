-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketItems" (
    "title" TEXT NOT NULL,
    "contactAddress" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "volumeTraded" INTEGER NOT NULL,
    "floorPrice" INTEGER NOT NULL,
    "owners" TEXT[],
    "profileImage" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "MarketItems_title_key" ON "MarketItems"("title");

-- CreateIndex
CREATE UNIQUE INDEX "MarketItems_contactAddress_key" ON "MarketItems"("contactAddress");

-- CreateIndex
CREATE UNIQUE INDEX "MarketItems_description_key" ON "MarketItems"("description");

-- CreateIndex
CREATE UNIQUE INDEX "MarketItems_createdBy_key" ON "MarketItems"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "MarketItems_volumeTraded_key" ON "MarketItems"("volumeTraded");

-- CreateIndex
CREATE UNIQUE INDEX "MarketItems_floorPrice_key" ON "MarketItems"("floorPrice");
