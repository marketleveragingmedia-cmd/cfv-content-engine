'use client'

import { calculateAssetCounts } from '@/lib/asset-count-utils'

interface PackagePreviewProps {
  session: any
}

export function PackagePreview({ session }: PackagePreviewProps) {
  // Count assets using v3 asset counting logic
  const assets = session.assets || []
  const counts = calculateAssetCounts(assets)
  
  // Debug logging
  if (typeof window !== 'undefined' && counts.primaryTextAssets === 0 && counts.primaryVisualAssets === 0 && assets.length > 0) {
    console.log('[PackagePreview] Asset count debug:', {
      totalAssets: assets.length,
      counts,
      sampleAsset: assets[0] ? {
        importDestination: assets[0].importDestination,
        mimeType: assets[0].mimeType,
        fileName: assets[0].fileName,
        isPrimaryAsset: assets[0].isPrimaryAsset,
        isExportCopy: assets[0].isExportCopy,
        countInPrimaryAssetReadiness: assets[0].countInPrimaryAssetReadiness
      } : null
    })
  }
  
  const textAssets = counts.primaryTextAssets
  const visualAssets = counts.primaryVisualAssets
  const exportCopies = counts.exportCopies
  
  // Get completion percentage
  const completion = session.overallCompletion || session.completion?.overall || 0
  const requiredCompletion = session.requiredCompletion || session.completion?.required || 0
  
  return (
    <div 
      className="bg-gradient-to-br from-white to-green-50 rounded-xl border-2 p-6 md:p-8 shadow-lg"
      style={{ borderColor: '#1E8E5A' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold" style={{ color: '#1E8E5A' }}>
            📦 Vision Session Package
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Complete content package ready for production
          </p>
        </div>
        <div 
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold border-4"
          style={{ 
            background: `conic-gradient(#1E8E5A ${completion * 3.6}deg, #e5e7eb ${completion * 3.6}deg)`,
            borderColor: '#1E8E5A'
          }}
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-base md:text-lg" style={{ color: '#1E8E5A' }}>
            {completion}%
          </div>
        </div>
      </div>
      
      {/* Session Info */}
      <div className="bg-white rounded-lg p-4 md:p-6 mb-6 border-2" style={{ borderColor: '#e5e7eb' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Session ID</div>
            <div className="text-lg font-bold" style={{ color: '#1E8E5A' }}>{session.sessionId}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Theme</div>
            <div className="text-base font-semibold text-gray-900">{session.theme || 'Not set'}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Category</div>
            <div className="text-sm text-gray-700">{session.category || 'Uncategorized'}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Pathway Stage</div>
            <div className="text-sm text-gray-700">{session.founderPathwayStage || 'Not set'}</div>
          </div>
        </div>
      </div>
      
      {/* Asset Count Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 md:p-4 border-2" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-2xl md:text-3xl mb-1">📝</div>
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#1E8E5A' }}>{textAssets}</div>
          <div className="text-xs text-gray-600">Text Assets</div>
          {exportCopies > 0 && (
            <div className="text-xs text-gray-400 mt-1">+{exportCopies} exports</div>
          )}
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 border-2" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-2xl md:text-3xl mb-1">🖼️</div>
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#1E8E5A' }}>{visualAssets}</div>
          <div className="text-xs text-gray-600">Visual Assets</div>
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 border-2" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-2xl md:text-3xl mb-1">✅</div>
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#1E8E5A' }}>{requiredCompletion}%</div>
          <div className="text-xs text-gray-600">Required</div>
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 border-2" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-2xl md:text-3xl mb-1">📊</div>
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#C9A441' }}>{completion}%</div>
          <div className="text-xs text-gray-600">Overall</div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div 
        className="bg-white rounded-lg p-4 md:p-6 border-2"
        style={{ borderColor: '#1E8E5A' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#1E8E5A' }}>
              Package Status
            </div>
            <div className="text-lg font-bold text-gray-900">
              {completion >= 100 ? '🎉 Complete' : 
               requiredCompletion >= 100 ? '✨ Ready to Finalize' :
               completion >= 50 ? '🚀 In Production' : 
               '📝 In Development'}
            </div>
          </div>
          <div className="flex gap-2">
            <span 
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase"
              style={{ 
                background: session.status === 'published' ? '#1E8E5A' : '#C9A441',
                color: 'white'
              }}
            >
              {session.status?.replace(/-/g, ' ') || 'Draft'}
            </span>
          </div>
        </div>
      </div>
      
      {/* CFV Branding Footer */}
      <div className="mt-6 pt-4 border-t-2" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Cash Flow Visionaries Content Engine</span>
          <span className="font-semibold" style={{ color: '#1E8E5A' }}>Vision Session Package</span>
        </div>
      </div>
    </div>
  )
}
