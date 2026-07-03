import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const item = await prisma.checklistItem.update({
    where: { id: params.id },
    data: {
      completed: body.completed,
      completedAt: body.completed ? new Date() : null,
      status: body.status,
      notes: body.notes,
      updatedAt: new Date()
    }
  })
  return NextResponse.json(item)
}
