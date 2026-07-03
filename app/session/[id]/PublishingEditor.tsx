'use client'

import { useState } from 'react'

export function PublishingEditor({ item }: { item: any }) {
  const [liveUrl, setLiveUrl] = useState(item.liveUrl || '')
  
  const handleUpdate = async () => {
    await fetch(`/api/publishing/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liveUrl, status: liveUrl ? 'Published' : item.status })
    })
    window.location.reload()
  }
  
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="font-semibold w-48">{item.asset}</span>
      <span className="text-gray-500 text-sm w-24">{item.platform}</span>
      <input 
        type="text" 
        value={liveUrl} 
        onChange={(e) => setLiveUrl(e.target.value)}
        placeholder="Live URL"
        className="flex-1 px-2 py-1 bg-gray-800 rounded text-sm"
      />
      <button onClick={handleUpdate} className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm">Save</button>
    </div>
  )
}
