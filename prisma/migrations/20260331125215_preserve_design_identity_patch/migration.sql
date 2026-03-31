-- AlterTable
ALTER TABLE "StudentSession" ADD COLUMN     "className" TEXT,
ADD COLUMN     "gradeLevel" TEXT,
ADD COLUMN     "schoolName" TEXT,
ADD COLUMN     "studentCode" TEXT,
ADD COLUMN     "studentName" TEXT;

-- CreateIndex
CREATE INDEX "StudentSession_studentCode_idx" ON "StudentSession"("studentCode");

-- CreateIndex
CREATE INDEX "StudentSession_className_idx" ON "StudentSession"("className");
