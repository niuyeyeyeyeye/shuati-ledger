-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "leetcodeId" INTEGER,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "note" TEXT,
    "pitfall" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMin" INTEGER,
    "result" TEXT NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "memo" TEXT,
    "pitfallTag" TEXT,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_leetcodeId_key" ON "Problem"("leetcodeId");

-- CreateIndex
CREATE INDEX "Attempt_problemId_idx" ON "Attempt"("problemId");

-- CreateIndex
CREATE INDEX "Attempt_pitfallTag_idx" ON "Attempt"("pitfallTag");

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
