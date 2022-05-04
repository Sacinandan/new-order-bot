-- CreateTable
CREATE TABLE "RaidBosses" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "respawn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RaidBosses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RaidBosses_name_key" ON "RaidBosses"("name");
