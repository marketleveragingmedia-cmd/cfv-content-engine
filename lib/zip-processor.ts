import AdmZip from 'adm-zip'
import { prisma } from './prisma'
import { defaultChecklistTemplate } from './checklist-template'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { existsSync } from 'fs'

interface ManifestData {
  sessionId?: string
  theme?: string
  workingTitle?: string
  finalTitle?: string
  category?: string
  founderPathwayStage?: string
  primaryCTA?: string
  creator?: string
  brand?: string
  packageVersion?: string
  summary?: string
}

interface ProcessResult {
  sessionId: string
  assetsImported: number
  assetsMissing: number
  assetsUnclassified: number
  manifestFound: boolean
  errors: string[]
}

const TAB_MAPPING: Record<string, string> = {
  '01_Overview': 'Overview',
  '02_Transcript': 'Transcript',
  '03_Core_Message': 'Core Message',
  '04_YouTube_Long_Form': 'YouTube Long-Form',
  '05_Shorts': 'Shorts',
  '06_YouTube_Community': 'YouTube Community Post',
  '07_YouTube_Podcast': 'YouTube Podcast',
  '08_HeyGen': 'HeyGen',
  '09_SKOOL': 'SKOOL',
  '10_Founder_Pathway': 'Founder Pathway',
  '11_NotebookLM': 'NotebookLM',
  '12_Visual_Assets': 'Visual Assets',
  '13_Publishing': 'Links & Versions',
  '14_Exports': 'Links & Versions'
}

export async function processVisionSessionZip(
  zipPath: string,
  zipFilename: string
): Promise<ProcessResult> {
  const result: ProcessResult = {
    sessionId: '',
    assetsImported: 0,
    assetsMissing: 0,
    assetsUnclassified: 0,
    manifestFound: false,
    errors: []
  }

  try {
    const zip = new AdmZip(zipPath)
    const zipEntries = zip.getEntries()

    // Extract manifest
    let manifest: ManifestData | null = null
    const manifestEntry = zipEntries.find(e => 
      e.entryName.includes('manifest.json') || 
      e.entryName.includes('Manifest')
    )

    if (manifestEntry) {
      try {
        const manifestContent = manifestEntry.getData().toString('utf8')
        manifest = JSON.parse(manifestContent)
        result.manifestFound = true
      } catch (e) {
        result.errors.push(`Manifest parse error: ${e}`)
      }
    }

    // Use session ID from manifest or ZIP filename, or generate new
    let sessionId: string | undefined = manifest?.sessionId
    
    if (!sessionId) {
      // Try to extract from filename (e.g., CFV_VS_00001_...)
      const match = zipFilename.match(/CFV[_-]VS[_-](\d+)/i)
      if (match) {
        sessionId = `CFV-VS-${match[1]}`
      }
    }
    
    // Check if session ID already exists
    if (sessionId) {
      const existing = await prisma.visionSession.findUnique({ where: { sessionId } })
      if (existing) {
        sessionId = undefined // Force generation of new ID
      }
    }
    
    // Generate new session ID if needed
    if (!sessionId) {
      const lastSession = await prisma.visionSession.findFirst({
        orderBy: { sessionId: 'desc' }
      })
      const nextNumber = lastSession 
        ? parseInt(lastSession.sessionId.split('-')[2]) + 1 
        : 1
      sessionId = `CFV-VS-${String(nextNumber).padStart(5, '0')}`
    }
    
    result.sessionId = sessionId

    // Create Vision Session
    const session = await prisma.visionSession.create({
      data: {
        sessionId,
        theme: manifest?.theme || 'Imported Session',
        workingTitle: manifest?.workingTitle || zipFilename.replace('.zip', ''),
        finalTitle: manifest?.finalTitle,
        summary: manifest?.summary,
        category: manifest?.category,
        founderPathwayStage: manifest?.founderPathwayStage || 'Foundation',
        primaryCTA: manifest?.primaryCTA,
        creator: manifest?.creator || 'MzSamantha',
        brand: manifest?.brand || 'Cash Flow Visionaries',
        status: 'draft',
        originalZipPath: zipPath,
        originalZipFilename: zipFilename,
        lastImportedAt: new Date()
      }
    })

    // Create storage directory (use /tmp for Vercel serverless)
    const baseStorageDir = process.env.VERCEL ? '/tmp/cfv-storage' : join(process.cwd(), 'storage')
    const storageDir = join(baseStorageDir, sessionId)
    if (!existsSync(storageDir)) {
      await mkdir(storageDir, { recursive: true })
    }

    // Process each file
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue
      
      const entryPath = entry.entryName
      const fileName = basename(entryPath)
      const dirName = dirname(entryPath)
      
      // Determine tab
      let tab = 'Overview'
      for (const [folder, tabName] of Object.entries(TAB_MAPPING)) {
        if (entryPath.includes(folder)) {
          tab = tabName
          break
        }
      }

      // Extract file
      const fileData = entry.getData()
      const ext = extname(fileName).toLowerCase()
      const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
      const isText = ['.md', '.txt', '.json'].includes(ext)

      // Save to storage
      const storagePath = join(storageDir, fileName)
      await writeFile(storagePath, fileData)

      // Determine asset type
      let assetType = 'file'
      if (fileName.includes('Transcript')) assetType = 'transcript'
      else if (fileName.includes('Core-Message')) assetType = 'core_message'
      else if (fileName.includes('NotebookLM') && fileName.includes('Source')) assetType = 'notebooklm_source'
      else if (fileName.includes('NotebookLM') && fileName.includes('Instructions')) assetType = 'notebooklm_instructions'
      else if (isImage) assetType = 'image'

      // Read content if text
      let content = null
      if (isText) {
        content = fileData.toString('utf8')
      }

      // Create asset record
      await prisma.asset.create({
        data: {
          sessionId: session.id,
          tab,
          title: fileName.replace(/_/g, ' ').replace(/\.[^.]+$/, ''),
          content,
          filePath: storagePath,
          mimeType: getMimeType(ext),
          version: 1,
          approved: false,
          assetType
        }
      })

      result.assetsImported++
    }

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
        zipFilename,
        zipPath,
        manifestFound: result.manifestFound,
        manifestData: manifest ? JSON.stringify(manifest) : null,
        assetsImported: result.assetsImported,
        assetsMissing: result.assetsMissing,
        assetsUnclassified: result.assetsUnclassified,
        errors: result.errors.length > 0 ? result.errors.join('\n') : null
      }
    })

    return result

  } catch (error: any) {
    result.errors.push(error.message)
    throw error
  }
}

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  return mimeTypes[ext] || 'application/octet-stream'
}
