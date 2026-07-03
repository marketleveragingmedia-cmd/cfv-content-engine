import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const asset = await prisma.asset.findUnique({ where: { id: params.id } })
  if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  const action = req.nextUrl.searchParams.get('action')
  
  if (action === 'download' && asset.filePath) {
    const file = await readFile(asset.filePath)
    return new NextResponse(file, {
      headers: {
        'Content-Type': asset.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${asset.title}"`
      }
    })
  }
  
  return NextResponse.json(asset)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const asset = await prisma.asset.update({
    where: { id: params.id },
    data: {
      approved: body.approved,
      approvedBy: body.approvedBy,
      approvedAt: body.approved ? new Date() : null,
      updatedAt: new Date()
    }
  })
  return NextResponse.json(asset)
}
