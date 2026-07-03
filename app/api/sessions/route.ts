import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sessions = await prisma.visionSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { assets: true, checklistItems: true }
        }
      }
    })
    
    return NextResponse.json({ sessions, count: sessions.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
