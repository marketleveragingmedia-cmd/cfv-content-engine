'use client'

import { useState } from 'react'

const TABS = [
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
  { id: 'checklist', label: 'Publishing Checklist', icon: '✅' },
  { id: 'links', label: 'Links & Versions', icon: '🔗' },
  { id: 'audit', label: 'Import / Audit Log', icon: '📊' }
]

export default function SessionTabs({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState('overview')
  
  const activeTabData = TABS.find(t => t.id === activeTab)
  
  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 border-b border-gray-800">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-h-[400px]">
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
          <label className="block text-sm font-semibold text-gray-400 mb-2">Summary</label>
          <p className="text-gray-300">{session.summary}</p>
        </div>
      )}
      
      {session.primaryCTA && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-400 mb-2">Primary CTA</label>
          <p className="text-gray-300">{session.primaryCTA}</p>
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
        <div className="text-center py-12 text-gray-500">
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
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{asset.title}</h3>
          <p className="text-sm text-gray-500">Version {asset.version}</p>
        </div>
        {asset.approved && (
          <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded">Approved</span>
        )}
      </div>
      
      {asset.content && (
        <div className="text-sm text-gray-400 mb-3 line-clamp-3">{asset.content.substring(0, 200)}...</div>
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
      
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <h3 className="font-bold mb-2">📄 NotebookLM Source</h3>
        <p className="text-sm text-gray-400 mb-3">Clean source document for upload</p>
        {source ? (
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition">View</button>
            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition">Copy</button>
            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition">Download</button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No source document available</p>
        )}
      </div>
      
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <h3 className="font-bold mb-2">📋 Generation Instructions</h3>
        <p className="text-sm text-gray-400 mb-3">Instructions for NotebookLM output</p>
        {instructions ? (
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition">View</button>
            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition">Copy</button>
            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition">Download</button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No instructions available</p>
        )}
      </div>
    </div>
  )
}

function VisualAssetsTab({ session }: { session: any }) {
  const images = session.assets.filter((a: any) => a.mimeType?.startsWith('image/'))
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visual Assets</h2>
      
      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No visual assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image: any) => (
            <div key={image.id} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
              <div className="aspect-video bg-gray-900 rounded mb-2 flex items-center justify-center">
                <span className="text-4xl">🖼️</span>
              </div>
              <p className="text-sm font-semibold mb-2">{image.title}</p>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition">View</button>
                <button className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition">Download</button>
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
            <div key={category} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">{category}</h3>
                <span className="text-sm text-gray-400">{completed}/{items.length}</span>
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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Links & Versions</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-2">Original Package</h3>
          <p className="text-sm text-gray-400 mb-2">{session.originalZipFilename}</p>
          <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition">
            Download Original ZIP
          </button>
        </div>
        
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-3">Export Session</h3>
          <Link href={`/api/session/${session.sessionId}/export`} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded inline-block">
            Download Complete Package
          </Link>
        </div>
        
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-3">Publishing Matrix</h3>
          <div className="space-y-1">
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
        <p className="text-gray-500">No import history</p>
      ) : (
        <div className="space-y-3">
          {session.imports.map((log: any) => (
            <div key={log.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{log.importType.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-400">{log.zipFilename}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(log.importedAt).toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                <div>
                  <span className="text-gray-500">Imported:</span>
                  <span className="ml-2 font-semibold">{log.assetsImported}</span>
                </div>
                <div>
                  <span className="text-gray-500">Missing:</span>
                  <span className="ml-2 font-semibold">{log.assetsMissing}</span>
                </div>
                <div>
                  <span className="text-gray-500">Unclassified:</span>
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
      <label className="block text-sm font-semibold text-gray-400 mb-1">{label}</label>
      <p className="text-gray-200">{value}</p>
    </div>
  )
}
