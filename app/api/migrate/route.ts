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
    
    return NextResponse.json({ 
      success: true, 
      message: 'Migration applied successfully. All new columns added.' 
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
