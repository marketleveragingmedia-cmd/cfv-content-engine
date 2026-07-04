'use client'

import { useState } from 'react'

interface ReplaceZipModalProps {
  sessionId: string
  sessionName: string
  onClose: () => void
  onSuccess: () => void
}

export function ReplaceZipModal({ sessionId, sessionName, onClose, onSuccess }: ReplaceZipModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [strategy, setStrategy] = useState('smart_merge')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a ZIP file')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('strategy', strategy)
      formData.append('notes', notes)

      const response = await fetch(`/api/session/${sessionId}/replace-zip`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to replace package')
      }

      setResult(data)
      setTimeout(() => {
        onSuccess()
      }, 2000)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b-2" style={{ borderColor: '#1E8E5A' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color: '#1E8E5A' }}>
              🔄 Replace Vision Session Package
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Upload a new ZIP package for: <strong>{sessionName}</strong>
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📦 New ZIP Package
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-green-500 p-2"
              disabled={uploading}
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Strategy Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              🎯 Update Strategy
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition"
                style={{ borderColor: strategy === 'smart_merge' ? '#1E8E5A' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="strategy"
                  value="smart_merge"
                  checked={strategy === 'smart_merge'}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="mt-1"
                  disabled={uploading}
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900">✨ Smart Merge (Recommended)</div>
                  <div className="text-sm text-gray-600">
                    Updates content from new ZIP while preserving your manual edits, completed checklist items, and approval status
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-yellow-50 transition"
                style={{ borderColor: strategy === 'add_new_only' ? '#C9A441' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="strategy"
                  value="add_new_only"
                  checked={strategy === 'add_new_only'}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="mt-1"
                  disabled={uploading}
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900">➕ Add New Only</div>
                  <div className="text-sm text-gray-600">
                    Only adds new assets from the ZIP. Doesn't modify any existing content or settings
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-red-50 transition"
                style={{ borderColor: strategy === 'replace_all' ? '#ef4444' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="strategy"
                  value="replace_all"
                  checked={strategy === 'replace_all'}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="mt-1"
                  disabled={uploading}
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900">🔥 Replace All (Destructive)</div>
                  <div className="text-sm text-gray-600">
                    Deletes all existing assets and replaces with content from new ZIP. Checklist progress preserved. Use with caution!
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📝 Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Fixed transcript typos, added missing shorts"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              rows={3}
              disabled={uploading}
            />
          </div>

          {/* Result */}
          {result && (
            <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
              <div className="font-bold text-green-900 mb-2">✅ {result.message}</div>
              <div className="text-sm text-green-800">
                <div>• Added: {result.changes.assetsAdded} assets</div>
                <div>• Updated: {result.changes.assetsUpdated} assets</div>
                <div>• Removed: {result.changes.assetsRemoved} assets</div>
              </div>
              <div className="text-xs text-green-700 mt-2">
                Refreshing page...
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg">
              <div className="font-bold text-red-900">❌ Error</div>
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading || !!result}
            className="px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            style={{ background: '#1E8E5A' }}
          >
            {uploading ? '⏳ Uploading...' : '🔄 Replace Package'}
          </button>
        </div>
      </div>
    </div>
  )
}
