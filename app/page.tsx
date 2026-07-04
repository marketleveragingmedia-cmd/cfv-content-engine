import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FounderReadinessMeter } from '@/components/FounderReadinessMeter'

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  try {
    const total = await prisma.visionSession.count()
    const inProgress = await prisma.visionSession.count({ where: { status: 'in-progress' } })
    const readyToPublish = await prisma.visionSession.count({ where: { status: 'ready-to-publish' } })
    const published = await prisma.visionSession.count({ where: { status: 'published' } })
    
    const recentSessions = await prisma.visionSession.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      include: {
        checklistItems: true,
        _count: {
          select: { assets: true }
        }
      }
    })
    
    // Get all sessions for Founder Readiness Meter
    const allSessions = await prisma.visionSession.findMany({
      select: {
        status: true,
        founderPathwayStage: true
      }
    })
    
    return { total, inProgress, readyToPublish, published, recentSessions, allSessions }
  } catch (error) {
    return { total: 0, inProgress: 0, readyToPublish: 0, published: 0, recentSessions: [], allSessions: [] }
  }
}

function calculateCompletion(checklistItems: any[]) {
  if (!checklistItems.length) return 0
  const completed = checklistItems.filter((item: any) => item.completed).length
  return Math.round((completed / checklistItems.length) * 100)
}

export default async function HomePage() {
  const { total, inProgress, readyToPublish, published, recentSessions, allSessions } = await getDashboardStats()
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--green-primary)'}}>
            🎬 Cash Flow Visionaries Content Engine
          </h1>
          <p style={{color: 'var(--text-secondary)'}}>
            Vision Session Management • Content Production • Publishing Workflow
          </p>
        </div>
        
        {/* Navigation Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <nav className="flex gap-3">
            <Link 
              href="/" 
              className="px-4 py-2 text-white rounded-lg font-semibold"
              style={{background: 'var(--green-primary)'}}
            >
              📊 Dashboard
            </Link>
            <Link 
              href="/import" 
              className="px-4 py-2 rounded-lg font-semibold transition hover:bg-green-50"
              style={{color: 'var(--green-primary)', border: '2px solid var(--green-primary)'}}
            >
              📥 Import Package
            </Link>
            <Link 
              href="/sessions" 
              className="px-4 py-2 rounded-lg font-semibold transition hover:bg-green-50"
              style={{color: 'var(--green-primary)', border: '2px solid var(--green-primary)'}}
            >
              📁 All Sessions
            </Link>
          </nav>
        </div>
        
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Sessions" value={total} color="green" />
            <StatCard label="In Progress" value={inProgress} color="yellow" />
            <StatCard label="Ready to Publish" value={readyToPublish} color="blue" />
            <StatCard label="Published" value={published} color="green" />
          </div>
        </div>

        {/* Founder Readiness Meter */}
        <div className="mb-6">
          <FounderReadinessMeter sessions={allSessions} />
        </div>
        
        {/* Recent Sessions Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--green-primary)'}}>
            Recent Sessions
          </h2>
          
          {recentSessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="mb-4" style={{color: 'var(--text-secondary)'}}>
                No sessions found. Import a Vision Session package to begin.
              </p>
              <Link 
                href="/import"
                className="inline-block px-5 py-2.5 text-white rounded-lg font-semibold shadow-sm"
                style={{background: 'linear-gradient(135deg, #2D8659 0%, #1F7A47 100%)'}}
              >
                📥 Import Package
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentSessions.map((session: any) => {
                const completion = calculateCompletion(session.checklistItems)
                return (
                  <Link
                    key={session.id}
                    href={`/session/${session.id}`}
                    className="border rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                    style={{borderColor: 'var(--border-color)'}}
                  >
                    <div className="font-semibold mb-2" style={{color: 'var(--green-primary)'}}>
                      {session.sessionId}
                    </div>
                    <h3 className="text-lg font-bold mb-3" style={{color: 'var(--text-primary)'}}>
                      {session.finalTitle || session.workingTitle || session.theme}
                    </h3>
                    
                    <div className="flex gap-4 text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
                      <span>📂 {session.category || 'Uncategorized'}</span>
                      <span>🎯 {session.founderPathwayStage || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs" style={{color: 'var(--text-secondary)'}}>
                        {session._count.assets} assets
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        session.status === 'published' ? 'bg-green-100 text-green-700' :
                        session.status === 'ready-to-publish' ? 'bg-blue-100 text-blue-700' :
                        session.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full transition-all" 
                        style={{width: `${completion}%`, background: 'var(--green-primary)'}}
                      />
                    </div>
                    <div className="text-xs" style={{color: 'var(--text-secondary)'}}>
                      {completion}% Complete
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap = {
    green: '#2D8659',
    yellow: '#EAB308',
    blue: '#3B82F6'
  }
  
  return (
    <div className="border rounded-lg p-4" style={{borderColor: 'var(--border-color)'}}>
      <div className="text-3xl font-bold mb-2" style={{color: colorMap[color as keyof typeof colorMap]}}>
        {value}
      </div>
      <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
        {label}
      </div>
    </div>
  )
}
