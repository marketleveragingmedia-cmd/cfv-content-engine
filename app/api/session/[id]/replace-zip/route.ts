import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, stat, readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import AdmZip from 'adm-zip'

/**
 * Replace/Update a Vision Session ZIP package
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File
    const strategy = formData.get('strategy') as string || 'smart_merge'
    const notes = formData.get('notes') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate strategy
    const validStrategies = ['replace_all', 'smart_merge', 'add_new_only']
    if (!validStrategies.includes(strategy)) {
      return NextResponse.json({ error: 'Invalid strategy' }, { status: 400 })
    }

    // Get existing session
    const session = await prisma.visionSession.findUnique({
      where: { id },
      include: {
        assets: true,
        zipVersions: { orderBy: { version: 'desc' } }
      }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Save uploaded ZIP
    const uploadsDir = '/tmp/cfv-imports'
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const timestamp = Date.now()
    const sanitizedFilename = file.name.replace(/[^a-z0-9.-]/gi, '_')
    const newZipFilename = `${session.sessionId}_v${(session.zipVersions[0]?.version || 0) + 1}_${timestamp}_${sanitizedFilename}`
    const newZipPath = join(uploadsDir, newZipFilename)
    
    await writeFile(newZipPath, buffer)
    const zipStats = await stat(newZipPath)

    // Extract and process ZIP
    const zip = new AdmZip(newZipPath)
    const zipEntries = zip.getEntries()

    const newVersion = (session.zipVersions[0]?.version || 0) + 1
    let assetsAdded = 0
    let assetsUpdated = 0
    let assetsRemoved = 0

    // Execute strategy
    if (strategy === 'replace_all') {
      // Delete all existing assets
      await prisma.asset.deleteMany({ where: { sessionId: id } })
      assetsRemoved = session.assets.length
    }

    // Process ZIP entries and create/update assets
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue
      
      const filename = entry.entryName
      const content = entry.getData().toString('utf8')
      
      // Simple asset creation (simplified for now)
      // In production, you'd want full manifest parsing
      try {
        const created = await prisma.asset.create({
          data: {
            sessionId: id,
            tab: 'Overview',
            assetType: 'text',
            title: filename,
            filename: filename,
            content: content.substring(0, 50000) // Limit size
          }
        })
        assetsAdded++
      } catch (err) {
        console.error('Error creating asset:', err)
      }
    }

    // Create version record
    await prisma.zipVersion.updateMany({
      where: { sessionId: id },
      data: { isCurrent: false }
    })

    await prisma.zipVersion.create({
      data: {
        sessionId: id,
        version: newVersion,
        isCurrent: true,
        zipPath: newZipPath,
        zipFilename: newZipFilename,
        zipSizeBytes: BigInt(zipStats.size),
        replaceStrategy: strategy,
        notes,
        assetsAdded,
        assetsUpdated,
        assetsRemoved
      }
    })

    // Update session
    await prisma.visionSession.update({
      where: { id },
      data: {
        originalZipPath: newZipPath,
        originalZipFilename: newZipFilename,
        packageVersion: newVersion.toString(),
        lastImportedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: `Package replaced successfully (Version ${newVersion})`,
      version: newVersion,
      strategy,
      changes: {
        assetsAdded,
        assetsUpdated,
        assetsRemoved
      }
    })

  } catch (error: any) {
    console.error('[replace-zip] Error:', error)
    return NextResponse.json({
      error: 'Failed to replace package',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
