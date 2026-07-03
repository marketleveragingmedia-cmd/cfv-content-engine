import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { defaultChecklistTemplate } from '@/lib/checklist-template'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Generate next session ID
    const lastSession = await prisma.visionSession.findFirst({
      orderBy: { sessionId: 'desc' }
    })
    
    const nextNumber = lastSession 
      ? parseInt(lastSession.sessionId.split('-')[2]) + 1 
      : 1
    const sessionId = `CFV-VS-${String(nextNumber).padStart(5, '0')}`
    
    // Save original ZIP
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    const zipPath = join(uploadsDir, `${sessionId}_${file.name}`)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(zipPath, buffer)
    
    // Create Vision Session
    const session = await prisma.visionSession.create({
      data: {
        sessionId,
        theme: 'Imported Session',
        workingTitle: `Imported from ${file.name}`,
        originalZipPath: zipPath,
        originalZipFilename: file.name,
        status: 'draft',
        founderPathwayStage: 'Foundation',
        lastImportedAt: new Date()
      }
    })
    
    // Create default checklist
    await prisma.checklistItem.createMany({
      data: defaultChecklistTemplate.map(item => ({
        sessionId: session.id,
        category: item.category,
        title: item.title,
        required: item.required,
        conditional: item.conditional || false,
        orderIndex: item.orderIndex,
        status: 'Not Started'
      }))
    })
    
    // Create default publishing matrix
    const publishingAssets = [
      { asset: 'YouTube Long-Form', platform: 'YouTube' },
      { asset: 'YouTube Podcast', platform: 'YouTube' },
      { asset: 'YouTube Community Post', platform: 'YouTube' },
      { asset: 'YouTube Short 1', platform: 'YouTube' },
      { asset: 'YouTube Short 2', platform: 'YouTube' },
      { asset: 'YouTube Short 3', platform: 'YouTube' },
      { asset: 'YouTube Short 4', platform: 'YouTube' },
      { asset: 'YouTube Short 5', platform: 'YouTube' },
      { asset: 'SKOOL Post', platform: 'SKOOL' },
      { asset: 'Facebook Post', platform: 'Facebook' },
      { asset: 'Instagram Post', platform: 'Instagram' }
    ]
    
    await prisma.publishingMatrixItem.createMany({
      data: publishingAssets.map(item => ({
        sessionId: session.id,
        asset: item.asset,
        platform: item.platform,
        status: 'Not Scheduled'
      }))
    })
    
    // Create import log
    await prisma.importLog.create({
      data: {
        sessionId: session.id,
        importType: 'new_session',
        zipFilename: file.name,
        zipPath,
        manifestFound: false,
        assetsImported: 0,
        assetsMissing: 0,
        assetsUnclassified: 0
      }
    })
    
    // Mark first checklist item complete
    await prisma.checklistItem.updateMany({
      where: {
        sessionId: session.id,
        title: 'Import package successfully'
      },
      data: {
        completed: true,
        completedAt: new Date(),
        status: 'Approved'
      }
    })
    
    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      status: session.status,
      assetsImported: 0
    })
    
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error.message || 'Import failed' },
      { status: 500 }
    )
  }
}
