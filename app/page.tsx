import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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
    
    return { total, inProgress, readyToPublish, published, recentSessions }
  } catch (error) {
    return { total: 0, inProgress: 0, readyToPublish: 0, published: 0, recentSessions: [] }
  }
}

function calculateCompletion(checklistItems: any[]) {
  if (checklistItems.length === 0) return 0
  const completed = checklistItems.filter((item: any) => item.completed).length
  return Math.round((completed / checklistItems.length) * 100)
}

function StatCard({ label, value, color = 'green' }: { label: string; value: number; color?: string }) {
  const colorClasses = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600'
  }
  
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
      <div className={`text-3xl font-bold mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value}
      </div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  )
}

export default async function Home() {
  const stats = await getDashboardStats()
  
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">🎬 Cash Flow Visionaries Content Engine</h1>
          <p className="text-gray-600">Vision Session Management • Content Production • Publishing Workflow</p>
        </header>
        
        <nav className="flex gap-3 mb-8 border-b border-gray-300 pb-4">
          <Link href="/" className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
            📊 Dashboard
          </Link>
          <Link href="/import" className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-semibold transition">
            📥 Import Package
          </Link>
          <Link href="/sessions" className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-semibold transition">
            📁 All Sessions
          </Link>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Sessions" value={stats.total} />
          <StatCard label="In Progress" value={stats.inProgress} color="yellow" />
          <StatCard label="Ready to Publish" value={stats.readyToPublish} color="blue" />
          <StatCard label="Published" value={stats.published} color="green" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
          
          {stats.recentSessions.length === 0 ? (
            <div className="bg-white border border-gray-300 rounded-xl p-12 text-center shadow-sm">
              <h3 className="text-xl text-gray-700 mb-3">No Vision Sessions Yet</h3>
              <p className="text-gray-600 mb-6">Import your first content package to get started</p>
              <Link href="/import" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                Import Package
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentSessions.map((session: any) => {
                const completion = calculateCompletion(session.checklistItems)
                return (
                  <Link key={session.id} href={`/session/${session.sessionId}`} className="bg-white border border-gray-300 rounded-xl p-5 hover:border-green-600 hover:shadow-md transition cursor-pointer">
                    <div className="text-green-600 font-semibold mb-2">{session.sessionId}</div>
                    <h3 className="text-lg font-bold mb-3">{session.finalTitle || session.workingTitle || session.theme}</h3>
                    
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      <span>📂 {session.category || 'Uncategorized'}</span>
                      <span>🎯 {session.founderPathwayStage || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-600">{session._count.assets} assets</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        session.status === 'published' ? 'bg-green-100 text-green-700' :
                        session.status === 'ready-to-publish' ? 'bg-blue-100 text-blue-700' :
                        session.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {session.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                      <div className="bg-green-600 h-full transition-all" style={{ width: `${completion}%` }} />
                    </div>
                    <div className="text-xs text-gray-600">{completion}% Complete</div>
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
