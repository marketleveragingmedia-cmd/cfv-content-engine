import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Determine Founder-Beta Level from Price ID
    let founderLevel = 'Unknown'
    const priceId = session.line_items?.data[0]?.price?.id
    if (priceId === process.env.STRIPE_CITIZEN_PRICE_ID) {
      founderLevel = 'Citizen Founder-Beta'
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      founderLevel = 'Enterprise Founder-Beta'
    }

    try {
      // Check for duplicate
      const existing = await prisma.founderBeta.findUnique({
        where: { stripeCheckoutSessionId: session.id },
      })

      if (existing) {
        console.log('Duplicate webhook event, skipping:', session.id)
        return NextResponse.json({ received: true, duplicate: true })
      }

      // Create Founder record
      await prisma.founderBeta.create({
        data: {
          fullName: session.customer_details?.name || '',
          email: session.customer_details?.email || '',
          phone: session.customer_details?.phone || null,
          founderLevel,
          amountPaid: session.amount_total || 0,
          currency: session.currency || 'usd',
          paymentStatus: session.payment_status,
          stripeCustomerId: session.customer as string,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          transactionDate: new Date(session.created * 1000),
        },
      })

      console.log('Founder record created:', session.id)
      return NextResponse.json({ received: true })
    } catch (error: any) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
