import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (!sessionId) {
    return NextResponse.json({ verified: false, error: 'No session ID' }, { status: 400, headers })
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
      return NextResponse.json({ verified: false, error: 'Not found' }, { status: 404, headers })
    }

    return NextResponse.json({
      verified: true,
      ...founder,
    }, { headers })
  } catch (error: any) {
    console.error('Error verifying founder:', error)
    return NextResponse.json({ verified: false, error: 'Database error' }, { status: 500, headers })
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
