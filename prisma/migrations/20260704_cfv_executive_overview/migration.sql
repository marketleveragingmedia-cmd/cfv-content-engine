-- CFV Content Engine Executive Overview Update
-- Add new fields for human-facing status, Movement theme, and Content type

-- Add new columns to VisionSession
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "humanStatus" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "movementTheme" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "contentType" TEXT DEFAULT 'Vision Session';
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "nextAction" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "nextActionReason" TEXT;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "requiredCompletion" INTEGER DEFAULT 0;
ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "overallCompletion" INTEGER DEFAULT 0;

-- Add founder review flag to ChecklistItem
ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "founderReview" BOOLEAN DEFAULT false;
ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "blockReason" TEXT;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS "VisionSession_humanStatus_idx" ON "VisionSession"("humanStatus");
CREATE INDEX IF NOT EXISTS "VisionSession_movementTheme_idx" ON "VisionSession"("movementTheme");
CREATE INDEX IF NOT EXISTS "VisionSession_contentType_idx" ON "VisionSession"("contentType");
CREATE INDEX IF NOT EXISTS "ChecklistItem_founderReview_idx" ON "ChecklistItem"("founderReview");
