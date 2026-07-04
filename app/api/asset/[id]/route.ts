import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'download'
    
    const asset = await prisma.asset.findUnique({
      where: { id }
    })
    
    if (!asset || !asset.content) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }
    
    const filename = `${asset.title.replace(/[^a-z0-9]/gi, '_')}.txt`
    
    if (mode === 'view') {
      // Return HTML page for viewing
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${asset.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.8;
      background: #f5f5f5;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: #2D8659;
      font-size: 24px;
    }
    .header .meta {
      color: #666;
      font-size: 14px;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      white-space: pre-wrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      color: #1a1a1a;
    }
    .actions {
      background: white;
      padding: 15px 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: #2D8659;
      color: white;
    }
    .btn-secondary {
      background: white;
      border: 2px solid #2D8659;
      color: #2D8659;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${asset.title}</h1>
    <div class="meta">Version ${asset.version || 1} • ${asset.assetType || 'Document'}</div>
  </div>
  
  <div class="actions">
    <button class="btn btn-secondary" onclick="window.history.back()">← Back</button>
    <button class="btn btn-primary" onclick="copyContent()">📋 Copy</button>
    <a class="btn btn-primary" href="/api/asset/${asset.id}?mode=download" download="${filename}">💾 Download</a>
  </div>
  
  <div class="content">${asset.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  
  <script>
    function copyContent() {
      const content = document.querySelector('.content').textContent;
      navigator.clipboard.writeText(content).then(() => {
        alert('Copied to clipboard!');
      });
    }
  </script>
</body>
</html>
      `
      
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }
    
    // Default: download mode
    return new NextResponse(asset.content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Asset fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 })
  }
}
