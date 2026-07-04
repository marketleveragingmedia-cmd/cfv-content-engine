'use client'

export function AssetActions({ asset }: { asset: any }) {
  const copyToClipboard = () => {
    if (asset.content) {
      navigator.clipboard.writeText(asset.content)
    }
  }
  
  const downloadAsset = () => {
    if (!asset.content) return
    
    const blob = new Blob([asset.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${asset.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="flex gap-2">
      <a
        href={`/api/asset/${asset.id}?mode=view`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-lg text-sm font-semibold transition"
      >
        👁️ View
      </a>
      <button
        onClick={copyToClipboard}
        className="px-3 py-1.5 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-lg text-sm font-semibold transition"
      >
        📋 Copy
      </button>
      <button
        onClick={downloadAsset}
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition"
      >
        💾 Download
      </button>
      {asset.approved && (
        <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
          ✅ Approved
        </span>
      )}
    </div>
  )
}
