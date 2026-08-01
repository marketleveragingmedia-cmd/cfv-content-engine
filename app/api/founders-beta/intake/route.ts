import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      sessionId,
      fullName,
      preferredName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      postalCode,
      country,
      preferredContactMethod,
    } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'No session ID' }, { status: 400 })
    }

    const founder = await prisma.founderBeta.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
    })

    if (!founder) {
      return NextResponse.json({ success: false, error: 'Founder not found' }, { status: 404 })
    }

    await prisma.founderBeta.update({
      where: { id: founder.id },
      data: {
        fullName,
        preferredName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,
        country,
        preferredContactMethod,
        founderIntakeStatus: 'Complete',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Intake error:', error)
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
}
