-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileImage" TEXT,
    "bannerImage" TEXT,
    "turfCoins" DOUBLE PRECISION,
    "confirmed" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketItems" (
    "title" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "volumeTraded" DOUBLE PRECISION,
    "floorPrice" INTEGER,
    "owners" TEXT[],
    "profileImage" TEXT,
    "bannerImage" TEXT,
    "logoImage" TEXT
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "nftName" TEXT NOT NULL,
    "collectionContractAddress" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NftTransactions" (
    "id" TEXT NOT NULL,
    "collectionContractAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT,
    "to" TEXT,
    "blockNumber" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,

    CONSTRAINT "NftTransactions_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "MarketItems_contractAddress_key" ON "MarketItems"("contractAddress");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_collectionContractAddress_fkey" FOREIGN KEY ("collectionContractAddress") REFERENCES "MarketItems"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NftTransactions" ADD CONSTRAINT "NftTransactions_collectionContractAddress_fkey" FOREIGN KEY ("collectionContractAddress") REFERENCES "MarketItems"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
