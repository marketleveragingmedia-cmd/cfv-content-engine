import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import AdmZip from 'adm-zip'
import { getCleanTitle } from '@/lib/format-session-title'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Query by database ID, not sessionId
    const session = await prisma.visionSession.findUnique({
      where: { id },
      include: {
        assets: { orderBy: { importDestination: 'asc' } },
        checklistItems: { orderBy: { orderIndex: 'asc' } },
        publishingMatrix: { orderBy: { createdAt: 'asc' } },
        imports: { orderBy: { importedAt: 'desc' }, take: 1 }
      }
    })
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    const zip = new AdmZip()
    const cleanTitle = getCleanTitle(session)
    
    // Create manifest
    const manifest = {
      session_id: session.sessionId,
      title: session.finalTitle || session.workingTitle || session.theme,
      clean_title: cleanTitle,
      movement_theme: session.theme,
      primary_category: session.category,
      content_type: session.contentType,
      founder_pathway_stage: session.founderPathwayStage,
      creator: session.creator,
      brand: session.brand,
      package_version: session.packageVersion,
      exported_at: new Date().toISOString(),
      total_assets: session.assets.length,
      total_checklist_items: session.checklistItems.length,
      total_publishing_matrix_items: session.publishingMatrix.length
    }
    
    zip.addFile('00_Manifest/manifest.json', Buffer.from(JSON.stringify(manifest, null, 2)))
    
    // Add assets by importDestination
    const assetsByDest: Record<string, any[]> = {}
    session.assets.forEach(asset => {
      const dest = asset.importDestination || 'Other'
      if (!assetsByDest[dest]) assetsByDest[dest] = []
      assetsByDest[dest].push(asset)
    })
    
    for (const [dest, assets] of Object.entries(assetsByDest)) {
      const folderName = dest.replace(/[^a-zA-Z0-9_-]/g, '_')
      
      for (const asset of assets) {
        let fileContent: Buffer
        let fileName = asset.fileName || `${asset.title}.txt`
        
        // Handle different asset storage types
        if (asset.content) {
          // Text content stored in database
          fileContent = Buffer.from(asset.content, 'utf8')
          if (!fileName.includes('.')) fileName += '.md'
        } else if (asset.filePath?.startsWith('data:')) {
          // Base64 data URI
          const base64Data = asset.filePath.split(',')[1]
          fileContent = Buffer.from(base64Data, 'base64')
        } else if (asset.filePath?.startsWith('https://')) {
          // Blob URL - fetch it
          try {
            const response = await fetch(asset.filePath)
            const arrayBuffer = await response.arrayBuffer()
            fileContent = Buffer.from(arrayBuffer)
          } catch (err) {
            console.error(`Failed to fetch blob for ${asset.title}:`, err)
            continue
          }
        } else {
          // Skip assets with no accessible content
          continue
        }
        
        zip.addFile(`${folderName}/${fileName}`, fileContent)
      }
    }
    
    // Add checklist as JSON
    zip.addFile(
      '00_Manifest/checklist.json',
      Buffer.from(JSON.stringify(session.checklistItems, null, 2))
    )
    
    // Add publishing matrix as JSON
    zip.addFile(
      '00_Manifest/publishing_matrix.json',
      Buffer.from(JSON.stringify(session.publishingMatrix, null, 2))
    )
    
    // Add README
    const readme = `# ${session.sessionId} — ${cleanTitle}

Exported: ${new Date().toISOString()}
Theme: ${session.theme}
Category: ${session.category}
Pathway Stage: ${session.founderPathwayStage}

Total Assets: ${session.assets.length}
Checklist Items: ${session.checklistItems.length}
Publishing Matrix Items: ${session.publishingMatrix.length}

Cash Flow Visionaries Content Engine
`
    zip.addFile('README.md', Buffer.from(readme))
    
    const buffer = zip.toBuffer()
    const filename = `${session.sessionId}_${cleanTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_export.zip`
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error: any) {
    console.error('[Export ZIP] Error:', error)
    return NextResponse.json(
      { error: 'Export failed', details: error.message },
      { status: 500 }
    )
  }
}
