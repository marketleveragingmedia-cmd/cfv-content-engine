import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const item = await prisma.publishingMatrixItem.update({
    where: { id: params.id },
    data: {
      status: body.status,
      scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
      publishedDate: body.publishedDate ? new Date(body.publishedDate) : null,
      liveUrl: body.liveUrl,
      updatedAt: new Date()
    }
  })
  return NextResponse.json(item)
}
