-- This migration adds the new fields if they don't exist
-- Run this directly on the production database

ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "humanStatus" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "movementTheme" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "contentType" TEXT DEFAULT 'Vision Session';
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "nextAction" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "nextActionReason" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "requiredCompletion" INTEGER DEFAULT 0;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "overallCompletion" INTEGER DEFAULT 0;

ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "founderReview" BOOLEAN DEFAULT false;
ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "blockReason" TEXT;

CREATE INDEX IF NOT EXISTS "VisionSession_humanStatus_idx" ON "VisionSession"("humanStatus");
CREATE INDEX IF NOT EXISTS "VisionSession_movementTheme_idx" ON "VisionSession"("movementTheme");
CREATE INDEX IF NOT EXISTS "VisionSession_contentType_idx" ON "VisionSession"("contentType");
CREATE INDEX IF NOT EXISTS "ChecklistItem_founderReview_idx" ON "ChecklistItem"("founderReview");
