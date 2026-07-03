import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SessionTabs from './SessionTabs'

export const dynamic = 'force-dynamic'

async function getSession(id: string) {
  const session = await prisma.visionSession.findUnique({
    where: { id },
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

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession(id)
  
  if (!session) {
    notFound()
  }
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <Link 
            href="/sessions"
            className="inline-block mb-6 font-semibold hover:underline"
            style={{color: 'var(--green-primary)'}}
          >
            ← Back to All Sessions
          </Link>
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--green-primary)'}}>
                {session.finalTitle || session.workingTitle || session.theme}
              </h1>
              <p className="text-base" style={{color: 'var(--text-secondary)'}}>
                <span className="font-semibold">{session.sessionId}</span> • {session.category || 'Mindset / Movement Foundation'}
              </p>
            </div>
            
            <div className="flex gap-3 items-start">
              <a
                href={`/api/session/${session.id}/export?format=pdf`}
                className="px-5 py-2.5 text-white rounded-lg font-semibold transition shadow-sm hover:shadow-md"
                style={{background: 'linear-gradient(135deg, #2D8659 0%, #1F7A47 100%)'}}
              >
                📥 Download PDF
              </a>
              <span className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap ${
                session.status === 'published' ? 'bg-green-100 text-green-700' :
                session.status === 'ready-to-publish' ? 'bg-blue-100 text-blue-700' :
                session.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-200 text-gray-700'
              }`}>
                {session.status.replace(/-/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetaCard label="Category" value={session.category || 'Mindset / Movement'} />
            <MetaCard label="Pathway Stage" value={session.founderPathwayStage || 'Foundation'} />
            <MetaCard label="Required Tasks" value={`${session.completion.required}%`} />
            <MetaCard label="Overall Progress" value={`${session.completion.overall}%`} />
          </div>
        </div>
        
        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <SessionTabs session={session} />
        </div>
      </div>
    </div>
  )
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg p-4" style={{borderColor: 'var(--border-color)'}}>
      <div className="text-sm mb-1" style={{color: 'var(--text-secondary)'}}>{label}</div>
      <div className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>{value}</div>
    </div>
  )
}
