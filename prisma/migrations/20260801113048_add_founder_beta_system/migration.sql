-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "FounderBeta_email_key" ON "FounderBeta"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FounderBeta_stripeCheckoutSessionId_key" ON "FounderBeta"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "FounderBeta_email_idx" ON "FounderBeta"("email");

-- CreateIndex
CREATE INDEX "FounderBeta_stripeCheckoutSessionId_idx" ON "FounderBeta"("stripeCheckoutSessionId");
