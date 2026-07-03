import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const query = searchParams.get('q')
  const status = searchParams.get('status')
  const stage = searchParams.get('stage')
  const category = searchParams.get('category')
  
  const where: any = {}
  
  if (query) {
    where.OR = [
      { sessionId: { contains: query, mode: 'insensitive' } },
      { theme: { contains: query, mode: 'insensitive' } },
      { workingTitle: { contains: query, mode: 'insensitive' } },
      { finalTitle: { contains: query, mode: 'insensitive' } }
    ]
  }
  
  if (status) where.status = status
  if (stage) where.founderPathwayStage = stage
  if (category) where.category = category
  
  const sessions = await prisma.visionSession.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      checklistItems: true,
      _count: { select: { assets: true } }
    }
  })
  
  return NextResponse.json(sessions)
}
