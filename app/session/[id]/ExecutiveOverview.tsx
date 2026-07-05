'use client'

import Link from 'next/link'
import { getNextAction, calculateAssetReadiness } from '@/lib/next-action-engine'
import { CopyAllButtons } from './CopyAllButtons'
import { PackagePreview } from '@/components/PackagePreview'
import { calculateAssetCounts } from '@/lib/asset-count-utils'

interface ExecutiveOverviewProps {
  session: any
  setActiveTab: (tab: string) => void
}

export function ExecutiveOverview({ session, setActiveTab }: ExecutiveOverviewProps) {
  const switchTab = (tabId: string) => {
    setActiveTab(tabId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-2" style={{borderColor: '#1E8E5A'}}>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <QuickActionButton onClick={() => switchTab('transcript')} label="View Transcript" icon="📝" />
          <QuickActionButton onClick={() => window.scrollBy(0, 600)} label="Copy YouTube Package" icon="📋" />
          <QuickActionButton onClick={() => switchTab('notebooklm')} label="Open NotebookLM Source" icon="📚" />
          <QuickActionButton onClick={() => switchTab('visual-assets')} label="View Visual Assets" icon="🖼️" />
          <QuickActionButton onClick={() => switchTab('checklist')} label="Update Checklist" icon="✅" />
          <QuickActionButton href={`/api/session/${session.id}/export`} label="Export ZIP" icon="💾" external />
        </div>
      </div>

      {/* Next Action Engine */}
      <NextActionCard session={session} setActiveTab={setActiveTab} />

      {/* Asset Readiness Strip */}
      <AssetReadinessStrip session={session} />

      {/* Package Preview */}
      <PackagePreview session={session} />

      {/* Copy All Buttons */}
      <CopyAllButtons session={session} />

      {/* Session Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6" style={{color: '#1E8E5A'}}>Session Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <SummaryField label="Session ID" value={session.sessionId} highlight />
            <SummaryField label="Title" value={session.finalTitle || session.workingTitle || session.theme} />
            <SummaryField label="Theme" value={session.theme} />
            <SummaryField label="Primary Category" value={session.category || 'Not set'} />
            <SummaryField label="Movement Theme" value={session.theme || 'Not set'} />
            <SummaryField label="Content Type" value={session.contentType || 'Vision Session'} />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <AssetCountsField assets={session.assets || []} />
            <SummaryField label="Founder Pathway Stage" value={session.founderPathwayStage || 'Not set'} />
            <SummaryField label="Status" value={session.humanStatus || session.status} badge />
            <SummaryField 
              label="Technical Status" 
              value={`${session.status} - ${session.overallCompletion || 0}% Complete`} 
              secondary 
            />
            <SummaryField 
              label="Required Completion" 
              value={`${session.requiredCompletion || 0}%`} 
              progress={session.requiredCompletion || 0}
            />
            <SummaryField 
              label="Overall Completion" 
              value={`${session.overallCompletion || 0}%`} 
              progress={session.overallCompletion || 0}
            />
            <SummaryField label="Creator" value={session.creator} />
          </div>
        </div>

        {/* Primary CTA */}
        {session.primaryCTA && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Primary Call to Action</label>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">{session.primaryCTA}</p>
          </div>
        )}

        {/* Summary */}
        {session.summary && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Summary</label>
            <p className="text-gray-900 leading-relaxed">{session.summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function QuickActionButton({ href, onClick, label, icon, external }: { href?: string; onClick?: () => void; label: string; icon: string; external?: boolean }) {
  if (external && href) {
    return (
      <a
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
        style={{borderColor: '#1E8E5A', color: '#1E8E5A'}}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
      style={{borderColor: '#1E8E5A', color: '#1E8E5A'}}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function NextActionCard({ session, setActiveTab }: { session: any; setActiveTab: (tab: string) => void }) {
  const nextActionData = getNextAction(session.checklistItems || [])
  
  if (!nextActionData) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 border-2" style={{borderColor: '#1E8E5A'}}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">✅</span>
          <div>
            <h3 className="text-xl font-bold" style={{color: '#1E8E5A'}}>All Required Tasks Complete!</h3>
            <p className="text-gray-700 mt-1">This Vision Session is ready for final review and publishing.</p>
          </div>
        </div>
      </div>
    )
  }

  const { taskTitle, reason, isBlocked, blockReason } = nextActionData

  return (
    <div className={`rounded-lg shadow-md p-6 border-2 ${isBlocked ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-green-50 to-yellow-50'}`} style={{borderColor: isBlocked ? '#ef4444' : '#C9A441'}}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold" style={{color: isBlocked ? '#dc2626' : '#1E8E5A'}}>
          {isBlocked ? '⚠️ BLOCKED' : '⚡ NEXT ACTION'}
        </h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${isBlocked ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isBlocked ? 'Blocked' : 'Required'}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-bold text-gray-900 mb-2">{taskTitle}</h4>
        <p className="text-gray-700 leading-relaxed">{reason}</p>
        {isBlocked && blockReason && (
          <div className="mt-3 p-3 bg-red-100 border-2 border-red-300 rounded-lg">
            <p className="text-sm font-semibold text-red-900"><strong>Block Reason:</strong> {blockReason}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        <button 
          onClick={() => {
            if (nextActionData?.assetTab) {
              setActiveTab(nextActionData.assetTab)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              setActiveTab('checklist')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="px-4 md:px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition text-sm md:text-base"
          style={{background: '#1E8E5A'}}
        >
          {nextActionData?.assetTab ? 'Open Asset' : 'View Checklist'}
        </button>
        <button 
          onClick={() => {
            setActiveTab('overview')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="px-4 md:px-6 py-2 bg-white border-2 font-semibold rounded-lg hover:bg-gray-50 transition text-sm md:text-base"
          style={{borderColor: '#1E8E5A', color: '#1E8E5A'}}
        >
          📝 Edit Session Details
        </button>
        <button 
          onClick={() => {
            setActiveTab('checklist')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="px-4 md:px-6 py-2 bg-white border-2 font-semibold rounded-lg hover:bg-gray-50 transition text-sm md:text-base"
          style={{borderColor: '#C9A441', color: '#C9A441'}}
        >
          ✓ Mark Complete
        </button>
      </div>
    </div>
  )
}

function AssetReadinessStrip({ session }: { session: any }) {
  const readiness = calculateAssetReadiness(
    session.checklistItems || [],
    session.assets || []
  )

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4" style={{color: '#1E8E5A'}}>Asset Readiness</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {readiness.map((item) => (
          <ReadinessIndicator 
            key={item.label} 
            label={item.label}
            status={item.status}
            color={item.color}
            tooltip={item.tooltip}
          />
        ))}
      </div>
    </div>
  )
}

function ReadinessIndicator({ label, status, color, tooltip }: { label: string; status: string; color: string; tooltip: string }) {
  const colorMap = {
    green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
    red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  }

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.gray

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-3`}>
      <div className="text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-semibold ${colors.text}`}>{status}</div>
    </div>
  )
}

function AssetCountsField({ assets }: { assets: any[] }) {
  const counts = calculateAssetCounts(assets)
  
  return (
    <div>
      <label className="block text-sm font-bold mb-1 uppercase tracking-wide text-gray-700">
        Assets
      </label>
      <div className="text-lg font-bold text-gray-900">
        <span className="text-green-700">{counts.primaryTextAssets}</span> Text •{' '}
        <span className="text-green-700">{counts.primaryVisualAssets}</span> Visual •{' '}
        <span className="text-gray-600">{counts.primaryAssetsTotal}</span> Primary
      </div>
      {counts.exportCopies > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {counts.exportCopies} export copies (not counted in primary)
        </p>
      )}
    </div>
  )
}

function SummaryField({ 
  label, 
  value, 
  highlight, 
  badge, 
  secondary, 
  progress 
}: { 
  label: string
  value: string
  highlight?: boolean
  badge?: boolean
  secondary?: boolean
  progress?: number
}) {
  return (
    <div>
      <label className={`block text-sm font-bold mb-1 uppercase tracking-wide ${secondary ? 'text-gray-500' : 'text-gray-700'}`}>
        {label}
      </label>
      {progress !== undefined ? (
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-bold" style={{color: highlight ? '#1E8E5A' : '#1a1a1a'}}>
              {value}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: progress >= 100 ? '#1E8E5A' : progress >= 50 ? '#C9A441' : '#94a3b8'
              }}
            />
          </div>
        </div>
      ) : badge ? (
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
          {value}
        </span>
      ) : (
        <p className={`text-lg font-bold ${highlight ? 'text-green-700' : 'text-gray-900'}`} style={{color: highlight ? '#1E8E5A' : undefined}}>
          {value}
        </p>
      )}
    </div>
  )
}
