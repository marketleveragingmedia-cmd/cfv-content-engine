'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ImportPage() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    setError(null)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/import-zip', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data.result)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">📥 Import Vision Session Package</h1>
          <p className="text-gray-600">Upload a Vision Session ZIP file to import all content and assets</p>
        </header>

        <nav className="flex gap-3 mb-8 border-b border-gray-300 pb-4">
          <Link href="/" className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-semibold transition">
            📊 Dashboard
          </Link>
          <Link href="/import" className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
            📥 Import Package
          </Link>
          <Link href="/sessions" className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-semibold transition">
            📁 All Sessions
          </Link>
        </nav>

        <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Select Vision Session ZIP File
              </label>
              <input
                type="file"
                name="file"
                accept=".zip"
                required
                disabled={uploading}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 file:cursor-pointer border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50"
              />
              <p className="mt-2 text-xs text-gray-500">
                ZIP should contain manifest.json and organized content folders
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
            >
              {uploading ? 'Importing...' : 'Import Package'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-700 mb-2">Import Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-3 text-lg">✅ Import Successful!</h3>
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p><strong>Session ID:</strong> {result.sessionId}</p>
                <p><strong>Assets Imported:</strong> {result.assetsImported}</p>
                <p><strong>Manifest Found:</strong> {result.manifestFound ? 'Yes' : 'No'}</p>
                {result.errors?.length > 0 && (
                  <p className="text-yellow-600"><strong>Warnings:</strong> {result.errors.length}</p>
                )}
              </div>
              <Link
                href={`/session/${result.sessionId}`}
                className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                View Session →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📦 Package Structure</h3>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <p>├── 00_Manifest/manifest.json</p>
            <p>├── 01_Overview/</p>
            <p>├── 02_Transcript/</p>
            <p>├── 03_Core_Message/</p>
            <p>├── 04_YouTube_Long_Form/</p>
            <p>├── 05_Shorts/</p>
            <p>├── 11_NotebookLM/</p>
            <p>└── 12_Visual_Assets/</p>
          </div>
        </div>
      </div>
    </div>
  )
}
