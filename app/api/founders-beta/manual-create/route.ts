import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  
  try {
    const founder = await prisma.founderBeta.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone || null,
        founderLevel: body.founderLevel,
        amountPaid: body.amountPaid,
        currency: 'USD',
        paymentStatus: 'paid',
        stripeCheckoutSessionId: body.stripeCheckoutSessionId,
        stripePaymentIntentId: body.stripePaymentIntentId || null,
        founderIntakeStatus: 'Pending',
        founderOrientationStatus: 'Not Started',
        transactionDate: new Date(),
      },
    })

    return NextResponse.json({ success: true, id: founder.id })
  } catch (error: any) {
    console.error('Error creating founder:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
