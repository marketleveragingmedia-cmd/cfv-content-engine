/**
 * Next Action Engine
 * Analyzes the Publishing Checklist and determines the next required action
 */

interface ChecklistItem {
  id: string
  title: string
  category: string
  required: boolean
  conditional: boolean
  founderReview: boolean
  status: string
  completed: boolean
  blockReason?: string | null
  orderIndex: number
}

interface NextAction {
  taskId: string
  taskTitle: string
  category: string
  reason: string
  actionType: 'open_asset' | 'update_task' | 'review' | 'upload'
  assetTab?: string
  isBlocked: boolean
  blockReason?: string
}

/**
 * Get the next required action from the checklist
 */
export function getNextAction(checklistItems: ChecklistItem[]): NextAction | null {
  // Filter for required items only
  const requiredItems = checklistItems.filter(item => item.required)
  
  // Sort by orderIndex to follow workflow sequence
  const sortedItems = requiredItems.sort((a, b) => a.orderIndex - b.orderIndex)
  
  // First, check for blocked items - these need attention immediately
  const blockedItem = sortedItems.find(item => 
    item.status === 'Blocked' && !item.completed
  )
  
  if (blockedItem) {
    return {
      taskId: blockedItem.id,
      taskTitle: blockedItem.title,
      category: blockedItem.category,
      reason: `This task is BLOCKED: ${blockedItem.blockReason || 'No reason provided'}. Resolve the blocker to continue the publishing workflow.`,
      actionType: 'update_task',
      isBlocked: true,
      blockReason: blockedItem.blockReason || undefined
    }
  }
  
  // Next, find the first incomplete required task
  const nextIncompleteTask = sortedItems.find(item => !item.completed && !item.status.includes('Skipped'))
  
  if (!nextIncompleteTask) {
    return null // All required tasks are complete!
  }
  
  // Determine the reason and action type based on category and task
  return {
    taskId: nextIncompleteTask.id,
    taskTitle: nextIncompleteTask.title,
    category: nextIncompleteTask.category,
    reason: getTaskReason(nextIncompleteTask),
    actionType: getActionType(nextIncompleteTask),
    assetTab: getAssetTab(nextIncompleteTask),
    isBlocked: false
  }
}

/**
 * Get human-readable reason why this task matters
 */
function getTaskReason(task: ChecklistItem): string {
  const categoryReasons: Record<string, string> = {
    'Session Setup': 'Complete session setup is required before content production can begin. This ensures all metadata and foundation are in place.',
    'Core Content': 'The transcript is the source material for YouTube, Podcast, Shorts, SKOOL, NotebookLM and all future visual assets. Everything builds from this foundation.',
    'YouTube Long-Form': 'YouTube Long-Form is the primary publishing surface for Vision Sessions. This is where the community first engages with the content.',
    'YouTube Podcast': 'The Podcast format extends reach and allows for audio-only consumption on podcast platforms.',
    'Shorts': 'Shorts are critical for discovery, engagement and driving traffic to the main Vision Session content.',
    'YouTube Community': 'Community posts keep the audience engaged between Vision Sessions and drive traffic to recent content.',
    'SKOOL': 'SKOOL is where the community discusses and applies the Vision Session content in the Founder Pathway.',
    'NotebookLM': 'NotebookLM creates AI-powered study materials and alternative content formats from the Vision Session.',
    'Visual Assets': 'Visual assets (thumbnails, graphics) are required for publishing across all platforms and drive click-through rates.',
    'Founder Review': 'Founder review ensures the content aligns with the Cash Flow Visionaries mission and brand standards before publishing.'
  }
  
  return categoryReasons[task.category] || 'Complete this task to continue the publishing workflow.'
}

/**
 * Determine the action type for the task
 */
function getActionType(task: ChecklistItem): 'open_asset' | 'update_task' | 'review' | 'upload' {
  const titleLower = task.title.toLowerCase()
  
  if (titleLower.includes('review') || titleLower.includes('approve')) {
    return 'review'
  }
  
  if (titleLower.includes('upload') || titleLower.includes('publish')) {
    return 'upload'
  }
  
  if (titleLower.includes('create') || titleLower.includes('draft') || titleLower.includes('generate')) {
    return 'open_asset'
  }
  
  return 'update_task'
}

/**
 * Map task to asset tab for quick navigation
 */
function getAssetTab(task: ChecklistItem): string | undefined {
  const categoryTabMap: Record<string, string> = {
    'Core Content': 'transcript',
    'YouTube Long-Form': 'youtube-long-form',
    'YouTube Podcast': 'youtube-podcast',
    'Shorts': 'shorts',
    'YouTube Community': 'youtube-community',
    'SKOOL': 'skool',
    'NotebookLM': 'notebooklm',
    'Visual Assets': 'visual-assets'
  }
  
  return categoryTabMap[task.category]
}

/**
 * Calculate asset readiness from checklist and assets
 */
export interface AssetReadiness {
  label: string
  status: string
  color: 'green' | 'yellow' | 'blue' | 'gray' | 'red'
  tooltip: string
}

export function calculateAssetReadiness(
  checklistItems: ChecklistItem[],
  assets: any[]
): AssetReadiness[] {
  return [
    getTranscriptReadiness(checklistItems, assets),
    getYouTubeLongFormReadiness(checklistItems, assets),
    getPodcastReadiness(checklistItems, assets),
    getShortsReadiness(checklistItems, assets),
    getYouTubeCommunityReadiness(checklistItems, assets),
    getSKOOLReadiness(checklistItems, assets),
    getNotebookLMReadiness(checklistItems, assets),
    getVisualAssetsReadiness(checklistItems, assets),
    getFounderReviewReadiness(checklistItems, assets),
  ]
}

function getTranscriptReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  // Check for any transcript assets - be flexible with naming
  const transcriptAssets = assets.filter(a => {
    const assetTypeLower = (a.assetType || '').toLowerCase()
    const tabLower = (a.tab || '').toLowerCase()
    const titleLower = (a.title || '').toLowerCase()
    
    return tabLower.includes('transcript') || 
           assetTypeLower.includes('transcript') ||
           titleLower.includes('transcript')
  })
  
  if (transcriptAssets.length === 0) {
    return { label: 'Transcript', status: 'Missing', color: 'gray', tooltip: 'No transcript found' }
  }
  
  const hasCleanTranscript = transcriptAssets.some(a => {
    const assetTypeLower = (a.assetType || '').toLowerCase()
    const titleLower = (a.title || '').toLowerCase()
    return assetTypeLower.includes('clean') || titleLower.includes('clean')
  })
  
  const isApproved = transcriptAssets.some(a => a.approved)
  
  if (isApproved) {
    return { label: 'Transcript', status: 'Ready', color: 'green', tooltip: 'Clean transcript approved' }
  }
  
  if (hasCleanTranscript) {
    return { label: 'Transcript', status: 'Ready', color: 'green', tooltip: `Clean transcript available (${transcriptAssets.length} asset${transcriptAssets.length > 1 ? 's' : ''})` }
  }
  
  return { label: 'Transcript', status: 'Needs Review', color: 'yellow', tooltip: `Transcript found, needs cleanup (${transcriptAssets.length} asset${transcriptAssets.length > 1 ? 's' : ''})` }
}

function getYouTubeLongFormReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  const ytItems = items.filter(i => i.category === 'YouTube Long-Form')
  const completed = ytItems.filter(i => i.completed).length
  const total = ytItems.length
  const hasPublished = ytItems.some(i => i.status === 'Published')
  
  if (hasPublished) {
    return { label: 'YouTube Long-Form', status: 'Published', color: 'green', tooltip: 'Published to YouTube' }
  }
  
  if (completed >= total * 0.8) {
    return { label: 'YouTube Long-Form', status: 'Ready to Publish', color: 'blue', tooltip: 'Ready for upload' }
  }
  
  if (completed > 0) {
    return { label: 'YouTube Long-Form', status: 'In Progress', color: 'yellow', tooltip: `${completed}/${total} tasks complete` }
  }
  
  return { label: 'YouTube Long-Form', status: 'Not Started', color: 'gray', tooltip: 'No progress yet' }
}

function getPodcastReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  const podcastItems = items.filter(i => i.category === 'YouTube Podcast')
  const hasApproved = podcastItems.some(i => i.status === 'Approved')
  const hasPublished = podcastItems.some(i => i.status === 'Published')
  
  if (hasPublished) {
    return { label: 'Podcast', status: 'Published', color: 'green', tooltip: 'Published to podcast platforms' }
  }
  
  if (hasApproved) {
    return { label: 'Podcast', status: 'Ready to Produce', color: 'blue', tooltip: 'Approved for production' }
  }
  
  return { label: 'Podcast', status: 'Needs Approval', color: 'yellow', tooltip: 'Awaiting approval' }
}

function getShortsReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  const shortsAssets = assets.filter(a => a.tab === 'Shorts')
  const shortsItems = items.filter(i => i.category === 'Shorts')
  const published = shortsItems.filter(i => i.status === 'Published').length
  const approved = shortsAssets.filter(a => a.approved).length
  
  if (published > 0) {
    return { label: 'Shorts', status: `${published} Published`, color: 'green', tooltip: `${published} shorts published` }
  }
  
  if (approved > 0) {
    return { label: 'Shorts', status: `${approved} Approved`, color: 'blue', tooltip: `${approved} shorts approved` }
  }
  
  if (shortsAssets.length > 0) {
    return { label: 'Shorts', status: 'Drafted', color: 'yellow', tooltip: 'Shorts drafted, needs approval' }
  }
  
  return { label: 'Shorts', status: 'Missing', color: 'gray', tooltip: 'No shorts created yet' }
}

function getYouTubeCommunityReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  const communityItems = items.filter(i => i.category === 'YouTube Community')
  const hasPublished = communityItems.some(i => i.status === 'Published')
  const hasApproved = communityItems.some(i => i.status === 'Approved')
  
  if (hasPublished) {
    return { label: 'YouTube Community', status: 'Published', color: 'green', tooltip: 'Community post published' }
  }
  
  if (hasApproved) {
    return { label: 'YouTube Community', status: 'Approved', color: 'blue', tooltip: 'Ready to publish' }
  }
  
  const communityAssets = assets.filter(a => a.tab === 'YouTube Community Post')
  if (communityAssets.length > 0) {
    return { label: 'YouTube Community', status: 'Drafted', color: 'yellow', tooltip: 'Draft created, needs approval' }
  }
  
  return { label: 'YouTube Community', status: 'Missing', color: 'gray', tooltip: 'No community post yet' }
}

function getSKOOLReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  const skoolItems = items.filter(i => i.category === 'SKOOL')
  const hasPublished = skoolItems.some(i => i.status === 'Published')
  const hasApproved = skoolItems.some(i => i.status === 'Approved')
  
  if (hasPublished) {
    return { label: 'SKOOL', status: 'Published', color: 'green', tooltip: 'Posted to SKOOL community' }
  }
  
  if (hasApproved) {
    return { label: 'SKOOL', status: 'Approved', color: 'blue', tooltip: 'Ready to post' }
  }
  
  const skoolAssets = assets.filter(a => a.tab === 'SKOOL')
  if (skoolAssets.length > 0) {
    return { label: 'SKOOL', status: 'Drafted', color: 'yellow', tooltip: 'Draft created, needs approval' }
  }
  
  return { label: 'SKOOL', status: 'Missing', color: 'gray', tooltip: 'No SKOOL content yet' }
}

function getNotebookLMReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  // Check for NotebookLM assets - be flexible with naming
  const notebookAssets = assets.filter(a => {
    const assetTypeLower = (a.assetType || '').toLowerCase()
    const tabLower = (a.tab || '').toLowerCase()
    const titleLower = (a.title || '').toLowerCase()
    
    return assetTypeLower.includes('notebooklm') ||
           tabLower.includes('notebooklm') ||
           titleLower.includes('notebooklm')
  })
  
  const hasSource = notebookAssets.some(a => {
    const assetTypeLower = (a.assetType || '').toLowerCase()
    const titleLower = (a.title || '').toLowerCase()
    return assetTypeLower.includes('source') || titleLower.includes('source')
  })
  
  const notebookItems = items.filter(i => i.category === 'NotebookLM')
  const hasUploaded = notebookItems.some(i => i.status === 'Published')
  
  if (hasUploaded) {
    return { label: 'NotebookLM', status: 'Uploaded', color: 'green', tooltip: 'Source uploaded to NotebookLM' }
  }
  
  if (hasSource || notebookAssets.length > 0) {
    return { label: 'NotebookLM', status: 'Source Ready', color: 'green', tooltip: `Source file ready (${notebookAssets.length} asset${notebookAssets.length > 1 ? 's' : ''})` }
  }
  
  return { label: 'NotebookLM', status: 'Missing', color: 'gray', tooltip: 'No NotebookLM source yet' }
}

function getVisualAssetsReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  const visualAssets = assets.filter(a => 
    a.assetType === 'Image' || a.mimeType?.startsWith('image/')
  )
  
  const approved = visualAssets.filter(a => a.approved).length
  const total = visualAssets.length
  
  if (approved === total && total > 0) {
    return { label: 'Visual Assets', status: 'Approved', color: 'green', tooltip: `All ${total} images approved` }
  }
  
  if (approved > 0) {
    return { label: 'Visual Assets', status: 'Partially Approved', color: 'yellow', tooltip: `${approved}/${total} images approved` }
  }
  
  if (total > 0) {
    return { label: 'Visual Assets', status: 'Needs Approval', color: 'yellow', tooltip: `${total} images need approval` }
  }
  
  return { label: 'Visual Assets', status: 'Missing', color: 'gray', tooltip: 'No visual assets yet' }
}

function getFounderReviewReadiness(items: ChecklistItem[], assets: any[]): AssetReadiness {
  const founderItems = items.filter(i => i.founderReview)
  
  if (founderItems.length === 0) {
    return { label: 'Founder Review', status: 'Not Needed', color: 'gray', tooltip: 'No founder review required' }
  }
  
  const approved = founderItems.filter(i => i.status === 'Approved').length
  const total = founderItems.length
  
  if (approved === total) {
    return { label: 'Founder Review', status: 'Approved', color: 'green', tooltip: 'All items approved by Founder' }
  }
  
  const blocked = founderItems.filter(i => i.status === 'Blocked').length
  if (blocked > 0) {
    return { label: 'Founder Review', status: 'Blocked', color: 'red', tooltip: `${blocked} items blocked by Founder` }
  }
  
  return { label: 'Founder Review', status: 'Pending', color: 'yellow', tooltip: `${approved}/${total} items approved` }
}
