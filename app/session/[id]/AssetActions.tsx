'use client'

export function AssetActions({ asset }: { asset: any }) {
  const handleView = () => {
    if (asset.content) {
      const blob = new Blob([asset.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    }
  }
  
  const handleCopy = async () => {
    if (asset.content) {
      await navigator.clipboard.writeText(asset.content)
      alert('Copied to clipboard')
    }
  }
  
  const handleDownload = () => {
    window.location.href = `/api/asset/${asset.id}?action=download`
  }
  
  const handleApprove = async () => {
    await fetch(`/api/asset/${asset.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !asset.approved, approvedBy: 'MzSamantha' })
    })
    window.location.reload()
  }
  
  return (
    <div className="flex gap-2">
      {asset.content && (
        <>
          <button onClick={handleView} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">View</button>
          <button onClick={handleCopy} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">Copy</button>
        </>
      )}
      <button onClick={handleDownload} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">Download</button>
      <button onClick={handleApprove} className={`px-3 py-1 rounded text-sm ${asset.approved ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}>
        {asset.approved ? 'Approved' : 'Approve'}
      </button>
    </div>
  )
}
