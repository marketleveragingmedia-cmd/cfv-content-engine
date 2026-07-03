'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ImportPage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<any>(null)
  const router = useRouter()
  
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    setProgress(0)
    setStatus('Uploading ZIP file...')
    setResult(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      setProgress(30)
      setStatus('Processing package...')
      
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      })
      
      setProgress(90)
      
      if (!response.ok) {
        throw new Error('Import failed')
      }
      
      const data = await response.json()
      
      setProgress(100)
      setStatus('Import complete!')
      setResult(data)
      
    } catch (error) {
      setStatus('Import failed')
      setResult({ error: 'Failed to import package' })
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-500 mb-2">
            📥 Import Vision Session Package
          </h1>
          <p className="text-gray-400">
            Upload a Cash Flow Visionaries Vision Session ZIP package
          </p>
        </header>
        
        {/* Navigation */}
        <nav className="flex gap-3 mb-8 border-b border-gray-800 pb-4">
          <Link 
            href="/" 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
          >
            📊 Dashboard
          </Link>
          <Link 
            href="/import" 
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold"
          >
            📥 Import Package
          </Link>
          <Link 
            href="/sessions" 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
          >
            📁 All Sessions
          </Link>
        </nav>
        
        {/* Upload Area */}
        {!result && (
          <div 
            onClick={() => document.getElementById('fileInput')?.click()}
            className="border-2 border-dashed border-gray-700 rounded-xl p-16 text-center bg-gray-900 hover:border-green-500 transition cursor-pointer"
          >
            <input 
              id="fileInput"
              type="file" 
              accept=".zip"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">Drop ZIP file or click to upload</h3>
            <p className="text-gray-400">Supported: Cash Flow Visionaries Vision Session packages (.zip)</p>
          </div>
        )}
        
        {/* Progress */}
        {uploading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Import Progress</h3>
            <div className="bg-gray-950 h-3 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm">{status}</p>
          </div>
        )}
        
        {/* Result */}
        {result && !result.error && (
          <div className="bg-gray-900 border border-green-500 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-500 mb-3">✓ Import Successful</h3>
            <p className="text-gray-400 mb-4">Session {result.sessionId} has been created</p>
            
            <div className="bg-gray-950 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Assets Imported:</span>
                  <span className="ml-2 font-semibold">{result.assetsImported || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 font-semibold capitalize">{result.status}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                href={`/session/${result.sessionId}`}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
              >
                Open Session
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        )}
        
        {/* Error */}
        {result?.error && (
          <div className="bg-gray-900 border border-red-500 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-500 mb-3">✗ Import Failed</h3>
            <p className="text-gray-400">{result.error}</p>
            <button
              onClick={() => {
                setResult(null)
                setProgress(0)
              }}
              className="mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
