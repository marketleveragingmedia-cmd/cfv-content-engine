import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Run raw SQL to add columns if they don't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "humanStatus" TEXT;
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "movementTheme" TEXT;
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "contentType" TEXT DEFAULT 'Vision Session';
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "nextAction" TEXT;
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "nextActionReason" TEXT;
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "requiredCompletion" INTEGER DEFAULT 0;
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "VisionSession" ADD COLUMN IF NOT EXISTS "overallCompletion" INTEGER DEFAULT 0;
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "founderReview" BOOLEAN DEFAULT false;
    `)
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "blockReason" TEXT;
    `)
    
    // Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "VisionSession_humanStatus_idx" ON "VisionSession"("humanStatus");
    `)
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "VisionSession_movementTheme_idx" ON "VisionSession"("movementTheme");
    `)
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "VisionSession_contentType_idx" ON "VisionSession"("contentType");
    `)
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ChecklistItem_founderReview_idx" ON "ChecklistItem"("founderReview");
    `)
    
    // Create ZipVersion table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ZipVersion" (
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
    `)
    
    // Add foreign key if table was just created
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'ZipVersion_sessionId_fkey'
        ) THEN
          ALTER TABLE "ZipVersion" ADD CONSTRAINT "ZipVersion_sessionId_fkey" 
            FOREIGN KEY ("sessionId") REFERENCES "VisionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `)
    
    // Create ZipVersion indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ZipVersion_sessionId_idx" ON "ZipVersion"("sessionId");
    `)
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ZipVersion_version_idx" ON "ZipVersion"("version");
    `)
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ZipVersion_isCurrent_idx" ON "ZipVersion"("isCurrent");
    `)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Migration applied successfully. All new columns and tables added.' 
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: 'If columns already exist, this error can be ignored.'
    }, { status: 500 })
  }
}
