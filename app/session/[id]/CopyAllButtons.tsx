'use client'

import { useState } from 'react'

interface CopyAllButtonsProps {
  session: any
}

export function CopyAllButtons({ session }: CopyAllButtonsProps) {
  const [copiedPackage, setCopiedPackage] = useState<string | null>(null)

  const copyToClipboard = async (text: string, packageName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPackage(packageName)
      setTimeout(() => setCopiedPackage(null), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const getYouTubeLongFormPackage = () => {
    const assets = session.assets || []
    const ytAssets = assets.filter((a: any) => a.tab === 'YouTube Long-Form')
    
    const title = ytAssets.find((a: any) => a.assetType?.includes('title'))?.content || session.finalTitle || session.workingTitle
    const description = ytAssets.find((a: any) => a.assetType?.includes('description'))?.content || ''
    const chapters = ytAssets.find((a: any) => a.assetType?.includes('chapter'))?.content || ''
    const tags = ytAssets.find((a: any) => a.assetType?.includes('tag') || a.assetType?.includes('keyword'))?.content || ''
    const cta = session.primaryCTA || ''
    const thumbnail = ytAssets.find((a: any) => a.assetType?.includes('thumbnail'))?.title || 'Thumbnail text not available'

    return `📺 YOUTUBE LONG-FORM PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TITLE:
${title}

📝 DESCRIPTION:
${description}

⏱️ CHAPTERS:
${chapters}

🏷️ TAGS/KEYWORDS:
${tags}

💬 CALL TO ACTION:
${cta}

🖼️ THUMBNAIL TEXT:
${thumbnail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session: ${session.sessionId}
Generated: ${new Date().toLocaleString()}
`
  }

  const getPodcastPackage = () => {
    const assets = session.assets || []
    const podcastAssets = assets.filter((a: any) => a.tab === 'YouTube Podcast')
    
    const title = podcastAssets.find((a: any) => a.assetType?.includes('title'))?.content || session.finalTitle
    const description = podcastAssets.find((a: any) => a.assetType?.includes('description'))?.content || ''
    const showNotes = podcastAssets.find((a: any) => a.assetType?.includes('show_notes'))?.content || ''
    const intro = podcastAssets.find((a: any) => a.assetType?.includes('intro'))?.content || ''
    const outro = podcastAssets.find((a: any) => a.assetType?.includes('outro'))?.content || ''
    const cta = session.primaryCTA || ''

    return `🎙️ PODCAST PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 PODCAST TITLE:
${title}

📝 DESCRIPTION:
${description}

📋 SHOW NOTES:
${showNotes}

🎬 INTRO:
${intro}

🎬 OUTRO:
${outro}

💬 CALL TO ACTION:
${cta}

🖼️ STATIC IMAGE GUIDANCE:
Use session thumbnail or create audio waveform visual

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session: ${session.sessionId}
Generated: ${new Date().toLocaleString()}
`
  }

  const getShortsPackage = () => {
    const assets = session.assets || []
    const shortsAssets = assets.filter((a: any) => a.tab === 'Shorts')
    
    if (shortsAssets.length === 0) {
      return 'No shorts content available yet. Create shorts content first.'
    }

    let package_text = `📱 SHORTS PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`
    
    shortsAssets.forEach((short: any, index: number) => {
      package_text += `
SHORT #${index + 1}: ${short.title}
━━━━━━━━━━━━━━━━━━━━━━━━━

HOOK/OPENING:
${short.content?.split('\n')[0] || 'No hook available'}

SCRIPT/EXCERPT:
${short.content || 'No content available'}

CAPTION:
${short.notes || session.theme}

CTA:
${session.primaryCTA || 'Join Cash Flow Visionaries'}

━━━━━━━━━━━━━━━━━━━━━━━━━
`
    })

    package_text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session: ${session.sessionId}
Total Shorts: ${shortsAssets.length}
Generated: ${new Date().toLocaleString()}
`
    
    return package_text
  }

  const getYouTubeCommunityPackage = () => {
    const assets = session.assets || []
    const communityAssets = assets.filter((a: any) => a.tab === 'YouTube Community Post')
    
    const postContent = communityAssets.find((a: any) => a.assetType?.includes('post'))?.content || session.summary || ''
    const question = communityAssets.find((a: any) => a.assetType?.includes('question'))?.content || ''
    const imageText = communityAssets.find((a: any) => a.assetType?.includes('image'))?.title || 'Use session thumbnail'

    return `💬 YOUTUBE COMMUNITY POST PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 POST COPY:
${postContent}

❓ QUESTION PROMPT:
${question}

🖼️ OPTIONAL IMAGE:
${imageText}

💡 POSTING TIP:
Post 24-48 hours after main video to drive traffic and engagement.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session: ${session.sessionId}
Generated: ${new Date().toLocaleString()}
`
  }

  const getSKOOLPackage = () => {
    const assets = session.assets || []
    const skoolAssets = assets.filter((a: any) => a.tab === 'SKOOL')
    
    const postContent = skoolAssets.find((a: any) => a.assetType?.includes('post'))?.content || session.summary || ''
    const discussion = skoolAssets.find((a: any) => a.assetType?.includes('discussion'))?.content || ''
    const cta = session.primaryCTA || ''
    const imageText = skoolAssets.find((a: any) => a.assetType?.includes('image'))?.title || 'Use session thumbnail'

    return `🏫 SKOOL PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 SKOOL POST:
${postContent}

💭 DISCUSSION PROMPT:
${discussion}

💬 CALL TO ACTION:
${cta}

🖼️ OPTIONAL IMAGE:
${imageText}

💡 POSTING TIP:
Encourage community discussion in Founder Pathway groups.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session: ${session.sessionId}
Generated: ${new Date().toLocaleString()}
`
  }

  const getNotebookLMPackage = () => {
    const assets = session.assets || []
    const notebookSource = assets.find((a: any) => a.assetType === 'notebooklm_source')
    const notebookInstructions = assets.find((a: any) => a.assetType === 'notebooklm_instructions')

    return `📚 NOTEBOOKLM UPLOAD PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 SOURCE DOCUMENT:
${notebookSource ? '✅ Available - Copy separately from NotebookLM tab' : '❌ Not available yet'}

📋 GENERATION INSTRUCTIONS:
${notebookInstructions ? '✅ Available - Copy separately from NotebookLM tab' : '❌ Not available yet'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 WORKFLOW:
1. Navigate to NotebookLM tab
2. Copy NotebookLM Source document
3. Upload to NotebookLM.google.com as a new source
4. Copy Generation Instructions
5. Paste into NotebookLM and generate content
6. Review and export generated materials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session: ${session.sessionId}
Generated: ${new Date().toLocaleString()}
`
  }

  const packages = [
    {
      id: 'youtube',
      label: 'YouTube Long-Form',
      icon: '🎥',
      color: 'bg-red-600 hover:bg-red-700',
      getContent: getYouTubeLongFormPackage
    },
    {
      id: 'podcast',
      label: 'Podcast',
      icon: '🎙️',
      color: 'bg-purple-600 hover:bg-purple-700',
      getContent: getPodcastPackage
    },
    {
      id: 'shorts',
      label: 'Shorts',
      icon: '📱',
      color: 'bg-pink-600 hover:bg-pink-700',
      getContent: getShortsPackage
    },
    {
      id: 'community',
      label: 'YouTube Community',
      icon: '💬',
      color: 'bg-blue-600 hover:bg-blue-700',
      getContent: getYouTubeCommunityPackage
    },
    {
      id: 'skool',
      label: 'SKOOL',
      icon: '🏫',
      color: 'bg-orange-600 hover:bg-orange-700',
      getContent: getSKOOLPackage
    },
    {
      id: 'notebooklm',
      label: 'NotebookLM',
      icon: '📚',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      getContent: getNotebookLMPackage
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2" style={{borderColor: '#1E8E5A'}}>
      <h3 className="text-lg font-bold mb-4" style={{color: '#1E8E5A'}}>
        📋 Copy Publishing Packages
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Copy complete, ready-to-paste packages for each publishing platform. All content is formatted and ready for immediate use.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => copyToClipboard(pkg.getContent(), pkg.id)}
            className={`${pkg.color} text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2`}
          >
            <span className="text-2xl">{pkg.icon}</span>
            <span className="text-sm">
              {copiedPackage === pkg.id ? '✓ Copied!' : pkg.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
