-- CreateTable
CREATE TABLE "garden_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "session" TEXT NOT NULL DEFAULT 'morning',
    "gratitude" JSONB,
    "intentions" JSONB,
    "goals" JSONB,
    "evening" JSONB,
    "cups" JSONB,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "coinsAwarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garden_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "garden_entries_userId_date_session_key" ON "garden_entries"("userId", "date", "session");

-- AddForeignKey
ALTER TABLE "garden_entries" ADD CONSTRAINT "garden_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
