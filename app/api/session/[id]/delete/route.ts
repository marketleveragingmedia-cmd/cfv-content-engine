import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { del } from '@vercel/blob'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get all assets with blob URLs to delete from storage
    const assets = await prisma.asset.findMany({
      where: { sessionId: id },
      select: { filePath: true }
    })
    
    // Delete blob storage files (only for https:// URLs)
    const blobDeletions = assets
      .filter(asset => asset.filePath?.startsWith('https://'))
      .map(asset => del(asset.filePath!))
    
    await Promise.allSettled(blobDeletions)
    
    // Delete related records (cascade)
    await prisma.asset.deleteMany({ where: { sessionId: id } })
    await prisma.checklistItem.deleteMany({ where: { sessionId: id } })
    await prisma.publishingMatrixItem.deleteMany({ where: { sessionId: id } })
    await prisma.importLog.deleteMany({ where: { sessionId: id } })
    
    // Delete the session
    const deleted = await prisma.visionSession.delete({
      where: { id }
    })
    
    return NextResponse.json({ 
      success: true, 
      deletedSessionId: deleted.sessionId,
      message: `Session ${deleted.sessionId} deleted successfully`
    })
  } catch (error: any) {
    console.error('Delete session error:', error)
    return NextResponse.json({ 
      error: error.message,
      success: false
    }, { status: 500 })
  }
}
