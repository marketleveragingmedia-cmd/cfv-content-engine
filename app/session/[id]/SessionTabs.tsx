'use client'

import { useState } from 'react'

const TABS = [
  { id: 'checklist', label: 'Publishing Checklist', icon: '✅' },
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'transcript', label: 'Transcript', icon: '📝' },
  { id: 'core-message', label: 'Core Message', icon: '💡' },
  { id: 'youtube-long-form', label: 'YouTube Long-Form', icon: '🎥' },
  { id: 'shorts', label: 'Shorts', icon: '📱' },
  { id: 'youtube-community', label: 'YouTube Community', icon: '💬' },
  { id: 'youtube-podcast', label: 'YouTube Podcast', icon: '🎙️' },
  { id: 'heygen', label: 'HeyGen', icon: '🤖' },
  { id: 'skool', label: 'SKOOL', icon: '🏫' },
  { id: 'founder-pathway', label: 'Founder Pathway', icon: '🎯' },
  { id: 'notebooklm', label: 'NotebookLM', icon: '📚' },
  { id: 'visual-assets', label: 'Visual Assets', icon: '🖼️' },
  { id: 'links', label: 'Links & Versions', icon: '🔗' },
  { id: 'audit', label: 'Import / Audit Log', icon: '📊' }
]

export default function SessionTabs({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState('checklist')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const activeTabData = TABS.find(t => t.id === activeTab)
  
  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-between font-semibold text-gray-900"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">{activeTabData?.icon}</span>
            <span>{activeTabData?.label}</span>
          </span>
          <span className="text-2xl">{sidebarOpen ? '✕' : '☰'}</span>
        </button>
        
        {sidebarOpen && (
          <div className="bg-white rounded-lg shadow-sm p-3 mt-2 max-h-96 overflow-y-auto">
            <nav className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold transition text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="flex-1">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
      
      <div className="flex gap-6">
        {/* Desktop Left Sidebar Navigation */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-3 sticky top-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 px-3">SECTIONS</h3>
            <nav className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold transition text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="flex-1">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[400px]">
        {activeTab === 'overview' && <OverviewTab session={session} />}
        {activeTab === 'transcript' && <AssetTab session={session} tab="Transcript" />}
        {activeTab === 'core-message' && <AssetTab session={session} tab="Core Message" />}
        {activeTab === 'youtube-long-form' && <AssetTab session={session} tab="YouTube Long-Form" />}
        {activeTab === 'shorts' && <AssetTab session={session} tab="Shorts" />}
        {activeTab === 'youtube-community' && <AssetTab session={session} tab="YouTube Community Post" />}
        {activeTab === 'youtube-podcast' && <AssetTab session={session} tab="YouTube Podcast" />}
        {activeTab === 'heygen' && <AssetTab session={session} tab="HeyGen" />}
        {activeTab === 'skool' && <AssetTab session={session} tab="SKOOL" />}
        {activeTab === 'founder-pathway' && <AssetTab session={session} tab="Founder Pathway" />}
        {activeTab === 'notebooklm' && <NotebookLMTab session={session} />}
        {activeTab === 'visual-assets' && <VisualAssetsTab session={session} />}
        {activeTab === 'checklist' && <ChecklistTab session={session} />}
        {activeTab === 'links' && <LinksTab session={session} />}
        {activeTab === 'audit' && <AuditTab session={session} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ session }: { session: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Session Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Field label="Session ID" value={session.sessionId} />
        <Field label="Status" value={session.status} />
        <Field label="Theme" value={session.theme} />
        <Field label="Category" value={session.category || 'Not set'} />
        <Field label="Founder Pathway Stage" value={session.founderPathwayStage || 'Not set'} />
        <Field label="Creator" value={session.creator} />
      </div>
      
      {session.summary && (
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-900 font-semibold mb-2">Summary</label>
          <p className="text-gray-900">{session.summary}</p>
        </div>
      )}
      
      {session.primaryCTA && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-900 font-semibold mb-2">Primary CTA</label>
          <p className="text-gray-900">{session.primaryCTA}</p>
        </div>
      )}
    </div>
  )
}

function AssetTab({ session, tab }: { session: any; tab: string }) {
  const assets = session.assets.filter((a: any) => a.tab === tab)
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{tab}</h2>
      
      {assets.length === 0 ? (
        <div className="text-center py-12 text-gray-700">
          <p>No assets found for this section</p>
          <p className="text-sm mt-2">Assets will appear here after import</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assets.map((asset: any) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  )
}

import { AssetActions } from './AssetActions'

function AssetCard({ asset }: { asset: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{asset.title}</h3>
          <p className="text-sm text-gray-700">Version {asset.version}</p>
        </div>
        {asset.approved && (
          <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded">Approved</span>
        )}
      </div>
      
      {asset.content && (
        <div className="text-sm text-gray-900 font-semibold mb-3 line-clamp-3">{asset.content.substring(0, 200)}...</div>
      )}
      
      <AssetActions asset={asset} />
    </div>
  )
}

function NotebookLMTab({ session }: { session: any }) {
  const source = session.assets.find((a: any) => a.assetType === 'notebooklm_source')
  const instructions = session.assets.find((a: any) => a.assetType === 'notebooklm_instructions')
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">NotebookLM Export</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-2">📄 NotebookLM Source</h3>
        <p className="text-sm text-gray-900 font-semibold mb-3">Clean source document for upload</p>
        {source ? (
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition">View</button>
            <button className="px-3 py-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded text-sm transition">Copy</button>
            <button className="px-3 py-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded text-sm transition">Download</button>
          </div>
        ) : (
          <p className="text-gray-700 text-sm">No source document available</p>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold mb-2">📋 Generation Instructions</h3>
        <p className="text-sm text-gray-900 font-semibold mb-3">Instructions for NotebookLM output</p>
        {instructions ? (
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition">View</button>
            <button className="px-3 py-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded text-sm transition">Copy</button>
            <button className="px-3 py-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded text-sm transition">Download</button>
          </div>
        ) : (
          <p className="text-gray-700 text-sm">No instructions available</p>
        )}
      </div>
    </div>
  )
}

function VisualAssetsTab({ session }: { session: any }) {
  // Try multiple possible image filters
  const images = session.assets.filter((a: any) => 
    a.assetType === 'Image' || 
    a.assetType === 'image' ||
    a.mimeType?.startsWith('image/') ||
    a.tab === 'Visual Assets' ||
    a.title?.toLowerCase().includes('thumbnail') ||
    a.title?.toLowerCase().includes('image')
  )
  
  const handleView = (imageId: string) => {
    window.open(`/api/asset/${imageId}?mode=view`, '_blank')
  }
  
  const handleDownload = (imageId: string, title: string) => {
    const link = document.createElement('a')
    link.href = `/api/asset/${imageId}?mode=download`
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Debug info
  const totalAssets = session.assets.length
  const assetTypes = [...new Set(session.assets.map((a: any) => a.assetType))].join(', ')
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visual Assets</h2>
      
      {images.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="font-semibold text-lg text-gray-900 mb-2">No visual assets found</p>
          <p className="text-sm text-gray-600 mb-4">Images will appear here after importing a Vision Session package with thumbnails</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto text-left">
            <p className="text-xs text-gray-700 font-semibold mb-2">Debug Info:</p>
            <p className="text-xs text-gray-600">Total assets: {totalAssets}</p>
            <p className="text-xs text-gray-600">Asset types: {assetTypes || 'none'}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image: any) => (
            <div key={image.id} className="bg-white border border-gray-200 rounded-lg p-3">
              {image.filePath ? (
                <img 
                  src={image.filePath}
                  alt={image.title}
                  className="aspect-video w-full object-cover rounded mb-2 cursor-pointer hover:opacity-90 transition"
                  onClick={() => handleView(image.id)}
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              ) : null}
              <div 
                className="aspect-video bg-gray-100 rounded mb-2 items-center justify-center"
                style={{ display: image.filePath ? 'none' : 'flex' }}
              >
                <span className="text-4xl">🖼️</span>
              </div>
              <p className="text-sm font-semibold mb-2 text-gray-900">{image.title}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleView(image.id)}
                  className="flex-1 px-2 py-1.5 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded text-xs font-semibold transition"
                >
                  👁️ View
                </button>
                <button 
                  onClick={() => handleDownload(image.id, image.title)}
                  className="flex-1 px-2 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded text-xs font-semibold transition"
                >
                  💾 Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { ChecklistEditor } from './ChecklistEditor'

function ChecklistTab({ session }: { session: any }) {
  const categories = [...new Set(session.checklistItems.map((i: any) => i.category))] as string[]
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Publishing Checklist</h2>
      
      <div className="space-y-6">
        {categories.map(category => {
          const items = session.checklistItems.filter((i: any) => i.category === category)
          const completed = items.filter((i: any) => i.completed).length
          
          return (
            <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">{category}</h3>
                <span className="text-sm text-gray-900 font-semibold">{completed}/{items.length}</span>
              </div>
              
              <div className="space-y-2">
                {items.map((item: any) => (
                  <ChecklistEditor key={item.id} item={item} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { PublishingEditor } from './PublishingEditor'
import Link from 'next/link'

function LinksTab({ session }: { session: any }) {
  const downloadOriginalZip = () => {
    if (!session.originalZipUrl) {
      alert('Original ZIP file not available')
      return
    }
    window.location.href = session.originalZipUrl
  }
  
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4">Links & Versions</h2>
      
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold mb-2 text-base md:text-lg">Original Package</h3>
          <p className="text-sm text-gray-900 font-semibold mb-3 break-words">{session.originalZipFilename || 'No original package'}</p>
          <button 
            onClick={downloadOriginalZip}
            className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm transition"
          >
            💾 Download Original ZIP
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-base md:text-lg">Export Session</h3>
          <p className="text-sm text-gray-700 mb-3">Download all assets as a complete package</p>
          <Link 
            href={`/api/session/${session.sessionId}/export`}
            className="block text-center md:inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
          >
            💾 Download Complete Package
          </Link>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-base md:text-lg">Publishing Matrix</h3>
          <div className="divide-y divide-gray-100">
            {session.publishingMatrix.map((item: any) => (
              <PublishingEditor key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuditTab({ session }: { session: any }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Import / Audit Log</h2>
      
      {session.imports.length === 0 ? (
        <p className="text-gray-700">No import history</p>
      ) : (
        <div className="space-y-3">
          {session.imports.map((log: any) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{log.importType.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-900 font-semibold">{log.zipFilename}</p>
                </div>
                <span className="text-xs text-gray-700">
                  {new Date(log.importedAt).toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                <div>
                  <span className="text-gray-700">Imported:</span>
                  <span className="ml-2 font-semibold">{log.assetsImported}</span>
                </div>
                <div>
                  <span className="text-gray-700">Missing:</span>
                  <span className="ml-2 font-semibold">{log.assetsMissing}</span>
                </div>
                <div>
                  <span className="text-gray-700">Unclassified:</span>
                  <span className="ml-2 font-semibold">{log.assetsUnclassified}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <p className="text-gray-900 font-semibold">{value}</p>
    </div>
  )
}
