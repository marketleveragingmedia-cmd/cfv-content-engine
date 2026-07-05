/**
 * Asset Count Utilities - Manifest-Driven v3.0
 * 
 * Calculates accurate primary asset counts based on manifest flags:
 * - is_primary_asset: true
 * - count_in_primary_asset_readiness: true
 * - is_export_copy: false
 */

const VISUAL_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']

interface Asset {
  isPrimaryAsset?: boolean
  isExportCopy?: boolean
  countInPrimaryAssetReadiness?: boolean
  filePath?: string | null
  fileName?: string | null
  assetType?: string
  mimeType?: string | null
  importDestination?: string | null
}

export interface AssetCounts {
  primaryTextAssets: number
  primaryVisualAssets: number
  primaryAssetsTotal: number
  exportCopies: number
  totalAssets: number
}

export function calculateAssetCounts(assets: Asset[]): AssetCounts {
  let primaryTextAssets = 0
  let primaryVisualAssets = 0
  let exportCopies = 0

  for (const asset of assets) {
    // Count export copies separately
    if (asset.isExportCopy) {
      exportCopies++
      continue
    }

    // Only count if marked as primary and should count in readiness
    if (!asset.isPrimaryAsset || !asset.countInPrimaryAssetReadiness) {
      continue
    }

    // Determine if visual or text
    // Priority: 1) mimeType, 2) importDestination, 3) file extension
    let isVisual = false
    
    if (asset.mimeType) {
      isVisual = asset.mimeType.startsWith('image/')
    } else if (asset.importDestination === 'Visual Assets') {
      isVisual = true
    } else {
      const fileName = asset.fileName || asset.filePath || ''
      const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
      isVisual = VISUAL_EXTENSIONS.includes(ext)
    }

    if (isVisual) {
      primaryVisualAssets++
    } else {
      primaryTextAssets++
    }
  }

  return {
    primaryTextAssets,
    primaryVisualAssets,
    primaryAssetsTotal: primaryTextAssets + primaryVisualAssets,
    exportCopies,
    totalAssets: assets.length
  }
}

/**
 * Get asset count display text
 */
export function getAssetCountDisplay(counts: AssetCounts): string {
  return `${counts.primaryTextAssets} Text • ${counts.primaryVisualAssets} Visual • ${counts.primaryAssetsTotal} Total Primary`
}
