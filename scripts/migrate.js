#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function runMigration() {
  console.log('🔄 Running database migration...');
  
  const prisma = new PrismaClient();
  
  try {
    // Check if table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'FounderBeta'
      );
    `;
    
    if (tableExists[0].exists) {
      console.log('✅ FounderBeta table already exists - skipping migration');
      await prisma.$disconnect();
      return;
    }
    
    console.log('📝 Creating FounderBeta table...');
    
    // Run migration SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "FounderBeta" (
        "id" TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "preferredName" TEXT,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "addressLine1" TEXT,
        "addressLine2" TEXT,
        "city" TEXT,
        "stateProvince" TEXT,
        "postalCode" TEXT,
        "country" TEXT,
        "preferredContactMethod" TEXT,
        "founderLevel" TEXT NOT NULL,
        "amountPaid" INTEGER NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'USD',
        "paymentStatus" TEXT NOT NULL,
        "stripeCustomerId" TEXT,
        "stripeCheckoutSessionId" TEXT,
        "stripePaymentIntentId" TEXT,
        "founderIntakeStatus" TEXT NOT NULL DEFAULT 'Pending',
        "founderOrientationStatus" TEXT NOT NULL DEFAULT 'Not Started',
        "transactionDate" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "FounderBeta_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log('📝 Creating indexes...');
    
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "FounderBeta_email_key" ON "FounderBeta"("email");`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "FounderBeta_stripeCheckoutSessionId_key" ON "FounderBeta"("stripeCheckoutSessionId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "FounderBeta_email_idx" ON "FounderBeta"("email");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX "FounderBeta_stripeCheckoutSessionId_idx" ON "FounderBeta"("stripeCheckoutSessionId");`);
    
    console.log('✅ Migration completed successfully!');
    
    await prisma.$disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runMigration();
