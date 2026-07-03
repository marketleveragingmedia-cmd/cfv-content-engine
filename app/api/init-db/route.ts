import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "VisionSession" ("id" TEXT NOT NULL, "sessionId" TEXT NOT NULL, "theme" TEXT NOT NULL, "workingTitle" TEXT, "finalTitle" TEXT, "summary" TEXT, "category" TEXT, "founderPathwayStage" TEXT, "primaryCTA" TEXT, "status" TEXT NOT NULL DEFAULT 'draft', "creator" TEXT NOT NULL DEFAULT 'MzSamantha', "brand" TEXT NOT NULL DEFAULT 'Cash Flow Visionaries', "originalZipPath" TEXT, "originalZipFilename" TEXT, "lastImportedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "VisionSession_pkey" PRIMARY KEY ("id"))`)
    
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Asset" ("id" TEXT NOT NULL, "sessionId" TEXT NOT NULL, "tab" TEXT NOT NULL, "title" TEXT NOT NULL, "content" TEXT, "filePath" TEXT, "mimeType" TEXT, "version" INTEGER NOT NULL DEFAULT 1, "approved" BOOLEAN NOT NULL DEFAULT false, "approvedBy" TEXT, "approvedAt" TIMESTAMP(3), "assetType" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Asset_pkey" PRIMARY KEY ("id"))`)
    
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ChecklistItem" ("id" TEXT NOT NULL, "sessionId" TEXT NOT NULL, "category" TEXT NOT NULL, "title" TEXT NOT NULL, "required" BOOLEAN NOT NULL DEFAULT false, "conditional" BOOLEAN NOT NULL DEFAULT false, "orderIndex" INTEGER NOT NULL, "completed" BOOLEAN NOT NULL DEFAULT false, "completedAt" TIMESTAMP(3), "status" TEXT NOT NULL DEFAULT 'Not Started', "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id"))`)
    
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "PublishingMatrixItem" ("id" TEXT NOT NULL, "sessionId" TEXT NOT NULL, "asset" TEXT NOT NULL, "platform" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'Not Scheduled', "scheduledDate" TIMESTAMP(3), "publishedDate" TIMESTAMP(3), "liveUrl" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "PublishingMatrixItem_pkey" PRIMARY KEY ("id"))`)
    
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ImportLog" ("id" TEXT NOT NULL, "sessionId" TEXT NOT NULL, "importType" TEXT NOT NULL, "zipFilename" TEXT NOT NULL, "zipPath" TEXT NOT NULL, "manifestFound" BOOLEAN NOT NULL DEFAULT false, "manifestData" TEXT, "assetsImported" INTEGER NOT NULL DEFAULT 0, "assetsMissing" INTEGER NOT NULL DEFAULT 0, "assetsUnclassified" INTEGER NOT NULL DEFAULT 0, "errors" TEXT, "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ImportLog_pkey" PRIMARY KEY ("id"))`)
    
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "VisionSession_sessionId_key" ON "VisionSession"("sessionId")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "VisionSession_status_idx" ON "VisionSession"("status")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "VisionSession_createdAt_idx" ON "VisionSession"("createdAt")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Asset_sessionId_idx" ON "Asset"("sessionId")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Asset_tab_idx" ON "Asset"("tab")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ChecklistItem_sessionId_idx" ON "ChecklistItem"("sessionId")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ChecklistItem_category_idx" ON "ChecklistItem"("category")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PublishingMatrixItem_sessionId_idx" ON "PublishingMatrixItem"("sessionId")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ImportLog_sessionId_idx" ON "ImportLog"("sessionId")`)

    try { await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD CONSTRAINT "Asset_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE`) } catch(e){}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE`) } catch(e){}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "PublishingMatrixItem" ADD CONSTRAINT "PublishingMatrixItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE`) } catch(e){}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "ImportLog" ADD CONSTRAINT "ImportLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE`) } catch(e){}

    return NextResponse.json({ success: true, message: 'Database initialized' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
