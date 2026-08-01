import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ verified: false, error: 'No session ID' }, { status: 400 })
  }

  try {
    const founder = await prisma.founderBeta.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        founderLevel: true,
        paymentStatus: true,
        founderIntakeStatus: true,
      },
    })

    if (!founder) {
      return NextResponse.json({ verified: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      verified: true,
      ...founder,
    })
  } catch (error: any) {
    console.error('Error verifying founder:', error)
    return NextResponse.json({ verified: false, error: 'Database error' }, { status: 500 })
  }
}
