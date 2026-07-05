import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import AdmZip from 'adm-zip'
import { getCleanTitle } from '@/lib/format-session-title'

// Expected asset types for validation
const REQUIRED_ASSETS = [
  'Clean Transcript',
  'Core Message',
  'YouTube Long-Form',
  'Shorts',
  'YouTube Community',
  'YouTube Podcast',
  'NotebookLM Source',
  'NotebookLM Generation Instructions',
  'Publishing Checklist',
  'Publishing Matrix',
  'Package Preview'
]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const exportStartTime = new Date()
  const missingAssets: string[] = []
  const includedAssets: string[] = []
  let exportVersion = 1
  
  try {
    const { id } = await params
    
    // Query by database ID OR sessionId for flexibility
    let session = await prisma.visionSession.findUnique({
      where: { id },
      include: {
        assets: { orderBy: { importDestination: 'asc' } },
        checklistItems: { orderBy: { orderIndex: 'asc' } },
        publishingMatrix: { orderBy: { createdAt: 'asc' } },
        imports: { orderBy: { importedAt: 'desc' }, take: 1 }
      }
    })
    
    // If not found by database ID, try sessionId
    if (!session) {
      session = await prisma.visionSession.findUnique({
        where: { sessionId: id },
        include: {
          assets: { orderBy: { importDestination: 'asc' } },
          checklistItems: { orderBy: { orderIndex: 'asc' } },
          publishingMatrix: { orderBy: { createdAt: 'asc' } },
          imports: { orderBy: { importedAt: 'desc' }, take: 1 }
        }
      })
    }
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    const zip = new AdmZip()
    const cleanTitle = getCleanTitle(session)
    const sessionId = session.sessionId
    
    // Asset counters
    let primaryTextAssets = 0
    let primaryVisualAssets = 0
    let exportCopies = 0
    let skippedAssets = 0
    
    // Create manifest
    const manifest = {
      session_id: sessionId,
      title: session.finalTitle || session.workingTitle || session.theme,
      clean_title: cleanTitle,
      movement_theme: session.theme,
      primary_category: session.category,
      content_type: session.contentType,
      founder_pathway_stage: session.founderPathwayStage,
      creator: session.creator,
      brand: session.brand,
      package_version: session.packageVersion || '1.0',
      exported_at: exportStartTime.toISOString(),
      export_version: exportVersion,
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
        let fileContent: Buffer | null = null
        let fileName = asset.fileName || `${asset.title}.txt`
        
        try {
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
            const response = await fetch(asset.filePath)
            if (!response.ok) throw new Error(`Blob fetch failed: ${response.status}`)
            const arrayBuffer = await response.arrayBuffer()
            fileContent = Buffer.from(arrayBuffer)
          }
          
          if (fileContent) {
            zip.addFile(`${folderName}/${fileName}`, fileContent)
            includedAssets.push(`${folderName}/${fileName}`)
            
            // Count asset types
            if (asset.isExportCopy) {
              exportCopies++
            } else if (asset.isPrimaryAsset && asset.countInPrimaryAssetReadiness) {
              if (asset.mimeType?.startsWith('image/') || asset.importDestination === 'Visual Assets') {
                primaryVisualAssets++
              } else {
                primaryTextAssets++
              }
            }
          } else {
            skippedAssets++
            missingAssets.push(`${asset.title} (${folderName})`)
          }
        } catch (err: any) {
          console.error(`Failed to add asset ${asset.title}:`, err)
          skippedAssets++
          missingAssets.push(`${asset.title} (${folderName}) - Error: ${err.message}`)
        }
      }
    }
    
    // Add checklist
    zip.addFile(
      '00_Manifest/checklist.json',
      Buffer.from(JSON.stringify(session.checklistItems, null, 2))
    )
    
    // Add publishing matrix
    zip.addFile(
      '00_Manifest/publishing_matrix.json',
      Buffer.from(JSON.stringify(session.publishingMatrix, null, 2))
    )
    
    // Create Export Report
    const exportReport = {
      export_metadata: {
        vision_session_id: sessionId,
        session_title: cleanTitle,
        export_timestamp: exportStartTime.toISOString(),
        export_version: exportVersion,
        export_status: missingAssets.length > 0 ? 'PARTIAL' : 'COMPLETE'
      },
      asset_summary: {
        total_assets: session.assets.length,
        primary_text_assets: primaryTextAssets,
        primary_visual_assets: primaryVisualAssets,
        export_copies: exportCopies,
        assets_included: includedAssets.length,
        assets_skipped: skippedAssets,
        checklist_items: session.checklistItems.length,
        publishing_matrix_items: session.publishingMatrix.length
      },
      included_assets: includedAssets.sort(),
      missing_assets: missingAssets.length > 0 ? missingAssets : ['None - All assets included successfully'],
      required_assets_check: REQUIRED_ASSETS.map(req => {
        let found = false
        
        // Special handling for specific asset types
        if (req === 'NotebookLM Source') {
          found = includedAssets.some(asset => 
            asset.toLowerCase().includes('notebooklm') && asset.toLowerCase().includes('source')
          )
        } else if (req === 'NotebookLM Generation Instructions') {
          found = includedAssets.some(asset => 
            asset.toLowerCase().includes('notebooklm') && 
            (asset.toLowerCase().includes('instruction') || asset.toLowerCase().includes('generation'))
          )
        } else {
          // General pattern matching
          const searchTerms = [
            req.toLowerCase().replace(/ /g, '-'),
            req.toLowerCase().replace(/ /g, '_'),
            req.toLowerCase()
          ]
          found = includedAssets.some(asset => {
            const assetLower = asset.toLowerCase()
            return searchTerms.some(term => assetLower.includes(term))
          })
        }
        
        return { asset: req, status: found ? 'INCLUDED' : 'MISSING' }
      }),
      warnings: missingAssets.length > 0 
        ? [`${missingAssets.length} asset(s) could not be included in this export`]
        : [],
      notes: [
        'This is an exported Vision Session package from Cash Flow Visionaries Content Engine',
        'Original imported assets are preserved and not modified by this export',
        'This export represents the current approved/working versions as of the export timestamp'
      ]
    }
    
    zip.addFile('00_Manifest/EXPORT_REPORT.json', Buffer.from(JSON.stringify(exportReport, null, 2)))
    
    // Add README
    const statusEmoji = missingAssets.length > 0 ? '⚠️' : '✅'
    const readme = `# ${sessionId} — ${cleanTitle}

${statusEmoji} Export Status: ${exportReport.export_metadata.export_status}

**Exported:** ${exportStartTime.toISOString()}
**Export Version:** v${exportVersion}

## Session Details
- **Theme:** ${session.theme}
- **Category:** ${session.category}
- **Pathway Stage:** ${session.founderPathwayStage}
- **Content Type:** ${session.contentType}

## Package Contents
- **Primary Text Assets:** ${primaryTextAssets}
- **Primary Visual Assets:** ${primaryVisualAssets}
- **Export Copies:** ${exportCopies}
- **Checklist Items:** ${session.checklistItems.length}
- **Publishing Matrix Items:** ${session.publishingMatrix.length}

${missingAssets.length > 0 ? `\n## ⚠️ Warnings\n${missingAssets.length} asset(s) could not be included. See EXPORT_REPORT.json for details.\n` : ''}

## Important Notes
- This export preserves the original imported assets (not modified)
- Contains current approved/working versions as of export timestamp
- See 00_Manifest/EXPORT_REPORT.json for complete export details

---
**Cash Flow Visionaries Content Engine**
`
    zip.addFile('README.md', Buffer.from(readme))
    
    const buffer = zip.toBuffer()
    
    // Version-safe filename
    const safeTitle = cleanTitle.replace(/[^a-zA-Z0-9_-]/g, '_')
    const filename = `${sessionId}_${safeTitle}_Export_v${exportVersion}.zip`
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error: any) {
    console.error('[Export ZIP] Error:', error)
    return NextResponse.json(
      { 
        error: 'Export failed', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
