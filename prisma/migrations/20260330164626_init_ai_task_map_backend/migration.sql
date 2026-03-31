-- CreateTable
CREATE TABLE "StudentSession" (
    "id" TEXT NOT NULL,
    "sessionCode" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "currentWorld" TEXT,
    "currentStep" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "deviceType" TEXT,
    "regionNote" TEXT,

    CONSTRAINT "StudentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "stepId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventValueJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "responseJson" JSONB NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StepResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIChatTurn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "turnNo" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIChatTurn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "submissionType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "selfCheckJson" JSONB,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreResult" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "evidenceJson" JSONB NOT NULL,
    "rubricVersion" TEXT NOT NULL,
    "scoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RubricSnapshot" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "ruleJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RubricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherNote" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "noteText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentSession_sessionCode_key" ON "StudentSession"("sessionCode");

-- CreateIndex
CREATE INDEX "StudentSession_status_idx" ON "StudentSession"("status");

-- CreateIndex
CREATE INDEX "StudentSession_language_idx" ON "StudentSession"("language");

-- CreateIndex
CREATE INDEX "EventLog_sessionId_worldId_idx" ON "EventLog"("sessionId", "worldId");

-- CreateIndex
CREATE INDEX "EventLog_eventName_idx" ON "EventLog"("eventName");

-- CreateIndex
CREATE INDEX "EventLog_createdAt_idx" ON "EventLog"("createdAt");

-- CreateIndex
CREATE INDEX "StepResponse_sessionId_worldId_idx" ON "StepResponse"("sessionId", "worldId");

-- CreateIndex
CREATE UNIQUE INDEX "StepResponse_sessionId_worldId_stepId_key" ON "StepResponse"("sessionId", "worldId", "stepId");

-- CreateIndex
CREATE INDEX "AIChatTurn_sessionId_worldId_idx" ON "AIChatTurn"("sessionId", "worldId");

-- CreateIndex
CREATE INDEX "AIChatTurn_turnNo_idx" ON "AIChatTurn"("turnNo");

-- CreateIndex
CREATE INDEX "Submission_sessionId_worldId_idx" ON "Submission"("sessionId", "worldId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_sessionId_worldId_key" ON "Submission"("sessionId", "worldId");

-- CreateIndex
CREATE INDEX "ScoreResult_sessionId_worldId_idx" ON "ScoreResult"("sessionId", "worldId");

-- CreateIndex
CREATE INDEX "ScoreResult_competenceId_idx" ON "ScoreResult"("competenceId");

-- CreateIndex
CREATE INDEX "ScoreResult_domainId_idx" ON "ScoreResult"("domainId");

-- CreateIndex
CREATE UNIQUE INDEX "RubricSnapshot_version_worldId_competenceId_key" ON "RubricSnapshot"("version", "worldId", "competenceId");

-- CreateIndex
CREATE INDEX "TeacherNote_sessionId_idx" ON "TeacherNote"("sessionId");

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepResponse" ADD CONSTRAINT "StepResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIChatTurn" ADD CONSTRAINT "AIChatTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreResult" ADD CONSTRAINT "ScoreResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherNote" ADD CONSTRAINT "TeacherNote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
