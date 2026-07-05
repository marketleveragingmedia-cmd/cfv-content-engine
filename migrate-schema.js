const { PrismaClient } = require('@prisma/client')

async function migrate() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL
      }
    }
  })

  try {
    // Run raw SQL migration
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
    
    console.log('✅ Schema migration successful')
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

migrate()
