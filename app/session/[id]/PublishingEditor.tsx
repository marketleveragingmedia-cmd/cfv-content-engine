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
    <div className="flex flex-col md:flex-row md:items-center gap-2 py-3 border-b border-gray-100 last:border-0">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-1">
        <span className="font-semibold text-sm md:text-base md:w-48">{item.asset}</span>
        <span className="text-gray-500 text-xs md:text-sm md:w-24">{item.platform}</span>
        <input 
          type="text" 
          value={liveUrl} 
          onChange={(e) => setLiveUrl(e.target.value)}
          placeholder="Live URL"
          className="flex-1 px-3 py-2 bg-white border-2 border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none w-full"
        />
      </div>
      <button 
        onClick={handleUpdate} 
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold transition w-full md:w-auto"
      >
        Save
      </button>
    </div>
  )
}
