'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteSessionButtonProps {
  sessionId: string
  sessionTitle: string
}

export default function DeleteSessionButton({ sessionId, sessionTitle }: DeleteSessionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/session/${sessionId}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      // Refresh the page to show updated list
      router.refresh()
    } catch (error: any) {
      console.error('Delete error:', error)
      alert(`Delete failed: ${error.message}`)
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition"
        disabled={isDeleting}
      >
        🗑️ Delete
      </button>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-red-600 font-semibold">Delete "{sessionTitle}"?</span>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 rounded transition"
      >
        {isDeleting ? 'Deleting...' : 'Confirm'}
      </button>
      <button
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 rounded transition"
      >
        Cancel
      </button>
    </div>
  )
}
