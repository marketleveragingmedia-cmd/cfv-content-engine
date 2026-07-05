import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Run schema migration
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "fileName" TEXT;
      ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "fileSize" INTEGER;
      ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "sha256" TEXT;
      ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "importDestination" TEXT;
      ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "isPrimaryAsset" BOOLEAN NOT NULL DEFAULT true;
      ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "isExportCopy" BOOLEAN NOT NULL DEFAULT false;
      ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "countInPrimaryAssetReadiness" BOOLEAN NOT NULL DEFAULT true;
      ALTER TABLE "Asset" ALTER COLUMN "version" TYPE TEXT USING version::TEXT;
      ALTER TABLE "Asset" ALTER COLUMN "version" SET DEFAULT '1';
      ALTER TABLE "Asset" ALTER COLUMN "tab" DROP NOT NULL;
    `)

    return NextResponse.json({ 
      success: true, 
      message: 'Schema migration completed successfully' 
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
