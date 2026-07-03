import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SessionTabs from './SessionTabs'

export const dynamic = 'force-dynamic'

async function getSession(sessionId: string) {
  const session = await prisma.visionSession.findUnique({
    where: { sessionId },
    include: {
      assets: { orderBy: { createdAt: 'desc' } },
      checklistItems: { orderBy: { orderIndex: 'asc' } },
      publishingMatrix: { orderBy: { createdAt: 'asc' } },
      imports: { orderBy: { importedAt: 'desc' } }
    }
  })
  
  if (!session) return null
  
  const requiredCompleted = session.checklistItems.filter((i: any) => i.required && i.completed).length
  const requiredTotal = session.checklistItems.filter((i: any) => i.required).length
  const allCompleted = session.checklistItems.filter((i: any) => i.completed).length
  const allTotal = session.checklistItems.length
  
  return {
    ...session,
    completion: {
      required: requiredTotal > 0 ? Math.round((requiredCompleted / requiredTotal) * 100) : 0,
      overall: allTotal > 0 ? Math.round((allCompleted / allTotal) * 100) : 0
    }
  }
}

export default async function SessionPage({ params }: { params: { id: string } }) {
  const session = await getSession(params.id)
  
  if (!session) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/"
            className="text-green-500 hover:text-green-400 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {session.finalTitle || session.workingTitle || session.theme}
              </h1>
              <p className="text-green-500 font-semibold">{session.sessionId}</p>
            </div>
            
            <div className="flex gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                session.status === 'published' ? 'bg-green-500/20 text-green-500' :
                session.status === 'ready-to-publish' ? 'bg-blue-500/20 text-blue-500' :
                session.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-gray-700 text-gray-300'
              }`}>
                {session.status.replace(/-/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetaCard label="Category" value={session.category || 'N/A'} />
            <MetaCard label="Stage" value={session.founderPathwayStage || 'N/A'} />
            <MetaCard label="Required Complete" value={`${session.completion.required}%`} />
            <MetaCard label="Overall Complete" value={`${session.completion.overall}%`} />
          </div>
          
          {/* Progress Bars */}
          <div className="space-y-3">
            <ProgressBar label="Required Tasks" percent={session.completion.required} />
            <ProgressBar label="All Tasks" percent={session.completion.overall} color="blue" />
          </div>
        </div>
        
        {/* Session Tabs */}
        <SessionTabs session={session} />
      </div>
    </div>
  )
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}

function ProgressBar({ label, percent, color = 'green' }: { label: string; percent: number; color?: string }) {
  const colorClass = color === 'green' ? 'bg-green-500' : 'bg-blue-500'
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <div className="bg-gray-900 h-2 rounded-full overflow-hidden">
        <div 
          className={`${colorClass} h-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
