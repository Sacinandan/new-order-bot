-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "discordUsername" VARCHAR(50) NOT NULL,
    "discordChannelId" VARCHAR(50) NOT NULL,
    "telegramUserId" INTEGER NOT NULL,
    "telegramUsername" VARCHAR(50) NOT NULL,
    "telegramChannelId" INTEGER NOT NULL,
    "accessToken" VARCHAR(255) NOT NULL,
    "refreshToken" VARCHAR(255) NOT NULL,
    "subscription" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_discordUserId_key" ON "Users"("discordUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_discordUsername_key" ON "Users"("discordUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegramUserId_key" ON "Users"("telegramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegramUsername_key" ON "Users"("telegramUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Users_accessToken_key" ON "Users"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Users_refreshToken_key" ON "Users"("refreshToken");
