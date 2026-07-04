import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processVisionSessionZip } from '@/lib/zip-processor'
import { writeFile, mkdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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
        checklistItems: true,
        zipVersions: { orderBy: { version: 'desc' } }
      }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Save uploaded ZIP to /tmp (Vercel-compatible)
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

    // Process the new ZIP
    const processingResult = await processVisionSessionZip(newZipPath, session.sessionId)

    if (processingResult.errors && processingResult.errors.length > 0) {
      return NextResponse.json({ 
        error: 'Failed to process ZIP',
        details: processingResult.errors.join(', ') 
      }, { status: 500 })
    }

    // Get new version number
    const newVersion = (session.zipVersions[0]?.version || 0) + 1

    // Execute strategy
    let assetsAdded = 0
    let assetsUpdated = 0
    let assetsRemoved = 0

    // Get newly imported assets from this processing run
    const newlyImportedAssets = await prisma.asset.findMany({
      where: { 
        sessionId: id,
        createdAt: { gte: new Date(Date.now() - 5000) } // Last 5 seconds
      }
    })

    if (strategy === 'replace_all') {
      // DELETE ALL existing OLD assets, keep newly imported ones
      const oldAssetIds = session.assets.map(a => a.id)
      await prisma.asset.deleteMany({ 
        where: { 
          sessionId: id,
          id: { in: oldAssetIds }
        } 
      })
      assetsRemoved = session.assets.length
      assetsAdded = newlyImportedAssets.length
      
    } else if (strategy === 'smart_merge') {
      // UPDATE existing assets, ADD new ones, KEEP manual edits
      const existingAssetsByKey = new Map(
        session.assets.map(a => [`${a.tab}:${a.assetType}:${a.title}`, a])
      )

      for (const newAsset of newlyImportedAssets) {
        const key = `${newAsset.tab}:${newAsset.assetType}:${newAsset.title}`
        const existing = existingAssetsByKey.get(key)

        if (existing && existing.id !== newAsset.id) {
          // Update old asset with new content, preserve manual edits
          await prisma.asset.update({
            where: { id: existing.id },
            data: {
              content: newAsset.content,
              filePath: newAsset.filePath || existing.filePath,
              filename: newAsset.filename || existing.filename,
              // Keep: approved, notes, liveUrl, version
            }
          })
          // Delete the duplicate new import
          await prisma.asset.delete({ where: { id: newAsset.id } })
          assetsUpdated++
        } else {
          // Truly new asset
          assetsAdded++
        }
      }

    } else if (strategy === 'add_new_only') {
      // ONLY keep assets that don't exist, remove duplicates
      const existingKeys = new Set(
        session.assets.map(a => `${a.tab}:${a.assetType}:${a.title}`)
      )

      for (const newAsset of newlyImportedAssets) {
        const key = `${newAsset.tab}:${newAsset.assetType}:${newAsset.title}`
        if (existingKeys.has(key)) {
          // Remove duplicate
          await prisma.asset.delete({ where: { id: newAsset.id } })
        } else {
          assetsAdded++
        }
      }
    }

    // Mark all previous versions as not current
    await prisma.zipVersion.updateMany({
      where: { sessionId: id },
      data: { isCurrent: false }
    })

    // Create new version record
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

    // Update session metadata
    await prisma.visionSession.update({
      where: { id },
      data: {
        originalZipPath: newZipPath,
        originalZipFilename: newZipFilename,
        packageVersion: newVersion.toString(),
        lastImportedAt: new Date(),
        updatedAt: new Date()
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
      details: error.message
    }, { status: 500 })
  }
}
