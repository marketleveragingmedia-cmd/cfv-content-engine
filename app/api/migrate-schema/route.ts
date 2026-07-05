import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Run schema migration - one statement at a time
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "fileName" TEXT`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "fileSize" INTEGER`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "sha256" TEXT`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "importDestination" TEXT`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "isPrimaryAsset" BOOLEAN NOT NULL DEFAULT true`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "isExportCopy" BOOLEAN NOT NULL DEFAULT false`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "countInPrimaryAssetReadiness" BOOLEAN NOT NULL DEFAULT true`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ALTER COLUMN "version" TYPE TEXT USING version::TEXT`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ALTER COLUMN "version" SET DEFAULT '1'`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ALTER COLUMN "tab" DROP NOT NULL`)

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
