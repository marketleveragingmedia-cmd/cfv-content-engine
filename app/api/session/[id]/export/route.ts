import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import AdmZip from 'adm-zip'
import { readFile } from 'fs/promises'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await prisma.visionSession.findUnique({
    where: { sessionId: id },
    include: { assets: true }
  })
  
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  const zip = new AdmZip()
  
  for (const asset of session.assets) {
    if (asset.filePath) {
      const file = await readFile(asset.filePath)
      zip.addFile(asset.title, file)
    } else if (asset.content) {
      zip.addFile(`${asset.title}.md`, Buffer.from(asset.content))
    }
  }
  
  const buffer = zip.toBuffer()
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${session.sessionId}_export.zip"`
    }
  })
}
