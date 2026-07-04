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
        className="flex-1 px-3 py-2 bg-white border-2 border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none"
      />
      <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold transition">Save</button>
    </div>
  )
}
