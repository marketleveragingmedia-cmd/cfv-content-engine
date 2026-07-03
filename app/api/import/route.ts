import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { processVisionSessionZip } from '@/lib/zip-processor'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'Only ZIP files are supported' }, { status: 400 })
    }
    
    // Save uploaded ZIP to temp location
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    const tempPath = join(uploadsDir, `temp_${Date.now()}_${file.name}`)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(tempPath, buffer)
    
    // Process ZIP with full extraction
    const result = await processVisionSessionZip(tempPath, file.name)
    
    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      assetsImported: result.assetsImported,
      assetsMissing: result.assetsMissing,
      assetsUnclassified: result.assetsUnclassified,
      manifestFound: result.manifestFound,
      errors: result.errors
    })
    
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error.message || 'Import failed' },
      { status: 500 }
    )
  }
}
