import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
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
  
  return { total, inProgress, readyToPublish, published, recentSessions }
}

function calculateCompletion(checklistItems: any[]) {
  if (checklistItems.length === 0) return 0
  const completed = checklistItems.filter(item => item.completed).length
  return Math.round((completed / checklistItems.length) * 100)
}

export default async function Dashboard() {
  const stats = await getDashboardStats()
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-500 mb-2">
            🎬 Cash Flow Visionaries Content Engine
          </h1>
          <p className="text-gray-400">
            Vision Session Management • Content Production • Publishing Workflow
          </p>
        </header>
        
        {/* Navigation */}
        <nav className="flex gap-3 mb-8 border-b border-gray-800 pb-4">
          <Link 
            href="/" 
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold"
          >
            📊 Dashboard
          </Link>
          <Link 
            href="/import" 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
          >
            📥 Import Package
          </Link>
          <Link 
            href="/sessions" 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
          >
            📁 All Sessions
          </Link>
        </nav>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Sessions" value={stats.total} />
          <StatCard label="In Progress" value={stats.inProgress} color="yellow" />
          <StatCard label="Ready to Publish" value={stats.readyToPublish} color="blue" />
          <StatCard label="Published" value={stats.published} color="green" />
        </div>
        
        {/* Recent Sessions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
          
          {stats.recentSessions.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <h3 className="text-xl text-gray-400 mb-3">No Vision Sessions Yet</h3>
              <p className="text-gray-500 mb-6">Import your first content package to get started</p>
              <Link 
                href="/import"
                className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
              >
                Import Package
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentSessions.map((session: any) => {
                const completion = calculateCompletion(session.checklistItems)
                return (
                  <Link 
                    key={session.id}
                    href={`/session/${session.sessionId}`}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500 transition cursor-pointer"
                  >
                    <div className="text-green-500 font-semibold mb-2">{session.sessionId}</div>
                    <h3 className="text-lg font-bold mb-3">{session.finalTitle || session.workingTitle || session.theme}</h3>
                    
                    <div className="flex gap-4 text-sm text-gray-400 mb-3">
                      <span>📂 {session.category || 'Uncategorized'}</span>
                      <span>🎯 {session.founderPathwayStage || 'N/A'}</span>
                    </div>
                    
                    <div className="bg-gray-950 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className="bg-green-500 h-full transition-all"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{completion}% Complete</div>
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

function StatCard({ label, value, color = 'green' }: { label: string; value: number; color?: string }) {
  const colorClasses = {
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500'
  }
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className={`text-3xl font-bold mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}
