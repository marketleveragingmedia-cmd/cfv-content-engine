import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete related records first (cascade)
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
