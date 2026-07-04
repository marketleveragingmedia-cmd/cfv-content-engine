-- Add ZIP version history tracking
CREATE TABLE "ZipVersion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "zipPath" TEXT NOT NULL,
    "zipFilename" TEXT NOT NULL,
    "zipSizeBytes" BIGINT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL DEFAULT 'system',
    "replaceStrategy" TEXT,
    "notes" TEXT,
    "assetsAdded" INTEGER NOT NULL DEFAULT 0,
    "assetsUpdated" INTEGER NOT NULL DEFAULT 0,
    "assetsRemoved" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ZipVersion_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "ZipVersion" ADD CONSTRAINT "ZipVersion_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "VisionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes
CREATE INDEX "ZipVersion_sessionId_idx" ON "ZipVersion"("sessionId");
CREATE INDEX "ZipVersion_version_idx" ON "ZipVersion"("version");
CREATE INDEX "ZipVersion_isCurrent_idx" ON "ZipVersion"("isCurrent");
