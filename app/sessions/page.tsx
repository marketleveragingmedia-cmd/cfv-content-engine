import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getSessions(searchParams: any) {
  const { status, stage, search } = searchParams
  
  const where: any = {}
  if (status) where.status = status
  if (stage) where.founderPathwayStage = stage
  if (search) {
    where.OR = [
      { sessionId: { contains: search, mode: 'insensitive' } },
      { theme: { contains: search, mode: 'insensitive' } },
      { workingTitle: { contains: search, mode: 'insensitive' } },
      { finalTitle: { contains: search, mode: 'insensitive' } }
    ]
  }
  
  return await prisma.visionSession.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      checklistItems: true,
      _count: { select: { assets: true } }
    }
  })
}

function calculateCompletion(checklistItems: any[]) {
  if (checklistItems.length === 0) return 0
  const completed = checklistItems.filter(item => item.completed).length
  return Math.round((completed / checklistItems.length) * 100)
}

export default async function SessionsPage({ searchParams }: { searchParams: any }) {
  const sessions = await getSessions(searchParams)
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-500">All Vision Sessions</h1>
          <Link
            href="/import"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
          >
            + Import New
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex gap-3 mb-8 border-b border-gray-800 pb-4">
          <Link 
            href="/" 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
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
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold"
          >
            📁 All Sessions
          </Link>
        </nav>
        
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="ready-for-review">Ready for Review</option>
            <option value="ready-to-publish">Ready to Publish</option>
            <option value="published">Published</option>
          </select>
          
          <select className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg">
            <option value="">All Stages</option>
            <option value="Foundation">Foundation</option>
            <option value="Founder Warm-Up">Founder Warm-Up</option>
            <option value="Founder Education">Founder Education</option>
            <option value="Founder Invitation">Founder Invitation</option>
          </select>
          
          <input 
            type="text"
            placeholder="Search sessions..."
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg"
          />
        </div>
        
        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <h3 className="text-xl text-gray-400 mb-3">No Sessions Found</h3>
            <p className="text-gray-500 mb-6">Import a Vision Session package to begin</p>
            <Link
              href="/import"
              className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
            >
              Import Package
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session: any) => {
              const completion = calculateCompletion(session.checklistItems)
              return (
                <Link
                  key={session.id}
                  href={`/session/${session.sessionId}`}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500 transition cursor-pointer"
                >
                  <div className="text-green-500 font-semibold mb-2">{session.sessionId}</div>
                  <h3 className="text-lg font-bold mb-3">
                    {session.finalTitle || session.workingTitle || session.theme}
                  </h3>
                  
                  <div className="flex gap-4 text-sm text-gray-400 mb-3">
                    <span>📂 {session.category || 'Uncategorized'}</span>
                    <span>🎯 {session.founderPathwayStage || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">
                      {session._count.assets} assets
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      session.status === 'published' ? 'bg-green-500/20 text-green-500' :
                      session.status === 'ready-to-publish' ? 'bg-blue-500/20 text-blue-500' :
                      session.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {session.status.replace(/-/g, ' ')}
                    </span>
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
  )
}
