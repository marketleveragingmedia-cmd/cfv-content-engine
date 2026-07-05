import AdmZip from 'adm-zip'
import { prisma } from './prisma'
import { defaultChecklistTemplate } from './checklist-template'
import { put } from '@vercel/blob'

/**
 * Manifest-Driven Vision Session ZIP Processor v3.0
 * 
 * REQUIREMENTS:
 * - Must read manifest.json first and use it as source of truth
 * - Must respect is_primary_asset, is_export_copy, count_in_primary_asset_readiness flags
 * - Must NOT count exports in 14_Exports/ as primary assets
 * - Must upload images to Vercel Blob storage for persistence
 * - Must create accurate asset records with proper classification
 */

interface ManifestFile {
  path: string
  asset_type: string
  title: string
  version: number
  sha256?: string
  is_export_copy: boolean
  is_primary_asset: boolean
  import_destination: string
  count_in_primary_asset_readiness: boolean
}

interface Manifest {
  package_type?: string
  package_version?: string
  vision_session_id: string
  working_title?: string
  final_title?: string
  display_title?: string
  theme?: string
  movement_theme?: string
  primary_category?: string
  content_type?: string
  founder_pathway_stage?: string
  primary_cta?: string
  creator?: string
  brand?: string
  status?: string
  files: ManifestFile[]
  canonical_asset_counts?: {
    primary_text_assets: number
    primary_visual_assets: number
    primary_assets_total: number
    export_copies: number
  }
}

interface ProcessResult {
  sessionId: string
  sessionDatabaseId: string
  displayTitle: string
  assetsImported: number
  primaryTextAssets: number
  primaryVisualAssets: number
  exportCopies: number
  manifestFound: boolean
  errors: string[]
  warnings: string[]
}

const VISUAL_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']

export async function processVisionSessionZipV3(
  zipPath: string,
  zipFilename: string,
  updateExisting: boolean = false
): Promise<ProcessResult> {
  const result: ProcessResult = {
    sessionId: '',
    sessionDatabaseId: '',
    displayTitle: '',
    assetsImported: 0,
    primaryTextAssets: 0,
    primaryVisualAssets: 0,
    exportCopies: 0,
    manifestFound: false,
    errors: [],
    warnings: []
  }

  try {
    const zip = new AdmZip(zipPath)
    const zipEntries = zip.getEntries()

    // STEP 1: Find and parse manifest.json (REQUIRED)
    const manifestEntry = zipEntries.find(e => 
      e.entryName.includes('00_Manifest/manifest.json') ||
      e.entryName.toLowerCase().endsWith('manifest.json')
    )

    if (!manifestEntry) {
      result.errors.push('No manifest.json found in package. Manifest-driven import required.')
      return result
    }

    let manifest: Manifest
    try {
      const manifestContent = manifestEntry.getData().toString('utf8')
      manifest = JSON.parse(manifestContent)
      result.manifestFound = true
    } catch (e: any) {
      result.errors.push(`Manifest parse error: ${e.message}`)
      return result
    }

    // STEP 2: Extract session metadata from manifest
    const sessionId = manifest.vision_session_id
    if (!sessionId) {
      result.errors.push('Manifest missing vision_session_id')
      return result
    }

    result.sessionId = sessionId
    result.displayTitle = manifest.display_title || `${sessionId} — ${manifest.working_title || 'Untitled'}`

    // STEP 3: Check for existing session (update vs new)
    let existingSession = null
    if (updateExisting) {
      existingSession = await prisma.visionSession.findFirst({
        where: { sessionId }
      })
    }

    // STEP 4: Create or update session record
    const sessionData = {
      sessionId,
      theme: manifest.movement_theme || manifest.theme || 'Uncategorized',
      workingTitle: manifest.working_title || 'Untitled',
      finalTitle: manifest.final_title || manifest.working_title || 'Untitled',
      category: manifest.primary_category || 'Uncategorized',
      contentType: manifest.content_type || 'Vision Session',
      founderPathwayStage: manifest.founder_pathway_stage || 'Foundation',
      primaryCTA: manifest.primary_cta || '',
      creator: manifest.creator || 'Unknown',
      brand: manifest.brand || 'Cash Flow Visionaries',
      status: 'draft',
      summary: '',
      packageVersion: manifest.package_version || '1.0',
      updatedAt: new Date()
    }

    let visionSession
    if (existingSession && updateExisting) {
      // Update existing
      visionSession = await prisma.visionSession.update({
        where: { id: existingSession.id },
        data: sessionData
      })
      
      // Clear old assets
      await prisma.asset.deleteMany({
        where: { sessionId: visionSession.id }
      })
    } else {
      // Create new
      visionSession = await prisma.visionSession.create({
        data: sessionData
      })
    }

    result.sessionDatabaseId = visionSession.id

    // STEP 5: Process each file from manifest
    for (const fileEntry of manifest.files) {
      try {
        // Find file in ZIP
        const zipEntry = zipEntries.find(e => 
          e.entryName === fileEntry.path ||
          e.entryName.endsWith(fileEntry.path)
        )

        if (!zipEntry) {
          result.warnings.push(`File not found in ZIP: ${fileEntry.path}`)
          continue
        }

        // Get file extension
        const ext = fileEntry.path.substring(fileEntry.path.lastIndexOf('.')).toLowerCase()
        const isVisual = VISUAL_EXTENSIONS.includes(ext)

        // Determine storage location
        let storagePath: string
        if (isVisual) {
          // Upload to Vercel Blob for persistent storage
          const fileBuffer = zipEntry.getData()
          const blobFilename = `${sessionId}/${fileEntry.path.split('/').pop()}`
          
          const blob = await put(blobFilename, fileBuffer, {
            access: 'public',
            contentType: `image/${ext.replace('.', '')}`
          })
          
          storagePath = blob.url
        } else {
          // Store path reference (text files retrieved from ZIP)
          storagePath = fileEntry.path
        }

        // Create asset record
        await prisma.asset.create({
          data: {
            sessionId: visionSession.id,
            assetType: fileEntry.asset_type,
            title: fileEntry.title,
            version: fileEntry.version.toString(),
            filePath: storagePath,
            fileName: fileEntry.path.split('/').pop() || fileEntry.path,
            fileSize: zipEntry.header.size || 0,
            importDestination: fileEntry.import_destination,
            isPrimaryAsset: fileEntry.is_primary_asset,
            isExportCopy: fileEntry.is_export_copy,
            countInPrimaryAssetReadiness: fileEntry.count_in_primary_asset_readiness,
            sha256: fileEntry.sha256 || '',
            createdAt: new Date()
          }
        })

        result.assetsImported++

        // Count asset types
        if (fileEntry.is_export_copy) {
          result.exportCopies++
        } else if (fileEntry.is_primary_asset && fileEntry.count_in_primary_asset_readiness) {
          if (isVisual) {
            result.primaryVisualAssets++
          } else {
            result.primaryTextAssets++
          }
        }

      } catch (error: any) {
        result.errors.push(`Error processing ${fileEntry.path}: ${error.message}`)
      }
    }

    // STEP 6: Initialize checklist from template
    if (!existingSession || updateExisting) {
      // Clear old checklist if updating
      if (existingSession) {
        await prisma.checklistItem.deleteMany({
          where: { sessionId: visionSession.id }
        })
      }

      // Create checklist from template
      for (const item of defaultChecklistTemplate) {
        await prisma.checklistItem.create({
          data: {
            sessionId: visionSession.id,
            taskName: item.taskName,
            taskType: item.taskType,
            category: item.category,
            requiredFor: item.requiredFor,
            displayOrder: item.displayOrder,
            completed: false,
            skipped: false
          }
        })
      }
    }

    // STEP 7: Log import success
    console.log(`[ZIP Processor v3] Import complete:`, {
      sessionId: result.sessionId,
      displayTitle: result.displayTitle,
      assetsImported: result.assetsImported,
      primaryTextAssets: result.primaryTextAssets,
      primaryVisualAssets: result.primaryVisualAssets,
      exportCopies: result.exportCopies
    })

  } catch (error: any) {
    result.errors.push(`Fatal import error: ${error.message}`)
    console.error('[ZIP Processor v3] Fatal error:', error)
  }

  return result
}
