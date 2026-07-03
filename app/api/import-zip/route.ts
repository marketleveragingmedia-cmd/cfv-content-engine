import { NextRequest, NextResponse } from 'next/server'
import { processVisionSessionZip } from '@/lib/zip-processor'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Save uploaded file temporarily
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const tempDir = '/tmp/cfv-imports'
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    const tempPath = path.join(tempDir, file.name)
    fs.writeFileSync(tempPath, buffer)
    
    // Process the ZIP
    const result = await processVisionSessionZip(tempPath, file.name)
    
    // Clean up temp file
    fs.unlinkSync(tempPath)
    
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
