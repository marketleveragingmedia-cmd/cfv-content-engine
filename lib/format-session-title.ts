/**
 * Format session title for display
 * Removes "Vision Session Package" and formats as "SESSION-ID — Title"
 */
export function formatSessionTitle(session: {
  sessionId: string
  finalTitle?: string | null
  workingTitle?: string | null
  theme?: string | null
}): string {
  // Get the raw title
  let title = session.finalTitle || session.workingTitle || session.theme || 'Untitled'
  
  // Remove "Vision Session Package" and variations
  title = title.replace(/Vision Session Package/gi, '').trim()
  title = title.replace(/Package$/i, '').trim()
  
  // Remove session ID from title if it's already there
  title = title.replace(new RegExp(`^${session.sessionId}\\s*[-–—]?\\s*`, 'i'), '').trim()
  
  // Format: "CFV-VS-00001 — Title"
  return `${session.sessionId} — ${title}`
}

/**
 * Get clean title without session ID (for exports, metadata)
 */
export function getCleanTitle(session: {
  finalTitle?: string | null
  workingTitle?: string | null
  theme?: string | null
}): string {
  let title = session.finalTitle || session.workingTitle || session.theme || 'Untitled'
  
  // Remove "Vision Session Package" and variations
  title = title.replace(/Vision Session Package/gi, '').trim()
  title = title.replace(/Package$/i, '').trim()
  
  // Remove any session ID prefix
  title = title.replace(/^CFV-VS-\d+\s*[-–—]?\s*/i, '').trim()
  
  return title
}
