'use client'

import { useState } from 'react'
import { ReplaceZipModal } from '@/components/ReplaceZipModal'

interface ReplacePackageButtonProps {
  sessionId: string
  sessionName: string
}

export function ReplacePackageButton({ sessionId, sessionName }: ReplacePackageButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const handleSuccess = () => {
    // Reload the page to show updated content
    window.location.reload()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 border-2 font-semibold rounded-lg transition hover:bg-green-50 text-sm md:text-base"
        style={{ borderColor: '#1E8E5A', color: '#1E8E5A' }}
      >
        🔄 Replace Package
      </button>

      {showModal && (
        <ReplaceZipModal
          sessionId={sessionId}
          sessionName={sessionName}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
