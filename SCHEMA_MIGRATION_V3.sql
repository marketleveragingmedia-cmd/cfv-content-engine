-- CFV Content Engine v3.0 Schema Migration
-- Run this in Vercel Dashboard → Storage → Postgres → Query

-- Add new Asset table columns for manifest-driven import
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "fileName" TEXT;
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "fileSize" INTEGER;
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "sha256" TEXT;
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "importDestination" TEXT;
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "isPrimaryAsset" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "isExportCopy" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "countInPrimaryAssetReadiness" BOOLEAN NOT NULL DEFAULT true;

-- Change version column from INTEGER to TEXT
ALTER TABLE "Asset" ALTER COLUMN "version" TYPE TEXT USING version::TEXT;
ALTER TABLE "Asset" ALTER COLUMN "version" SET DEFAULT '1';

-- Make tab column nullable (optional for v3 assets)
ALTER TABLE "Asset" ALTER COLUMN "tab" DROP NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Asset_sessionId_isPrimaryAsset_idx" ON "Asset"("sessionId", "isPrimaryAsset");
CREATE INDEX IF NOT EXISTS "Asset_sessionId_isExportCopy_idx" ON "Asset"("sessionId", "isExportCopy");

-- Verify migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'Asset'
ORDER BY ordinal_position;
