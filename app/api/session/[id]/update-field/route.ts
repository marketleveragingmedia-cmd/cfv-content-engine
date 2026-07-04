import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { field, value } = body

    // Whitelist of allowed fields to update
    const allowedFields = [
      'movementTheme',
      'humanStatus',
      'contentType',
      'finalTitle',
      'workingTitle',
      'theme',
      'category',
      'founderPathwayStage',
      'primaryCTA',
      'summary',
      'creator'
    ]

    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { error: `Field '${field}' is not allowed to be updated` },
        { status: 400 }
      )
    }

    const session = await prisma.visionSession.update({
      where: { id },
      data: { [field]: value }
    })

    return NextResponse.json({ success: true, session })
  } catch (error: any) {
    console.error('[update-field] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update field' },
      { status: 500 }
    )
  }
}
