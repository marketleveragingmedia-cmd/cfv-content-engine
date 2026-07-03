import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getSessions(searchParams: any) {
  try {
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
  } catch (error) {
    return []
  }
}

function calculateCompletion(checklistItems: any[]) {
  if (checklistItems.length === 0) return 0
  const completed = checklistItems.filter(item => item.completed).length
  return Math.round((completed / checklistItems.length) * 100)
}

export default async function SessionsPage({ searchParams }: { searchParams: any }) {
  const sessions = await getSessions(searchParams)
  
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">All Vision Sessions</h1>
          <Link href="/import" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
            + Import New
          </Link>
        </div>
        
        <nav className="flex gap-3 mb-8 border-b border-gray-300 pb-4">
          <Link href="/" className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-semibold transition">
            📊 Dashboard
          </Link>
          <Link href="/import" className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-semibold transition">
            📥 Import Package
          </Link>
          <Link href="/sessions" className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
            📁 All Sessions
          </Link>
        </nav>
        
        <div className="flex gap-3 mb-6">
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="ready-for-review">Ready for Review</option>
            <option value="ready-to-publish">Ready to Publish</option>
            <option value="published">Published</option>
          </select>
          
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
            <option value="">All Stages</option>
            <option value="Foundation">Foundation</option>
            <option value="Founder Warm-Up">Founder Warm-Up</option>
            <option value="Founder Education">Founder Education</option>
            <option value="Founder Invitation">Founder Invitation</option>
          </select>
          
          <input type="text" placeholder="Search sessions..." className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg" />
        </div>
        
        {sessions.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-xl p-12 text-center shadow-sm">
            <h3 className="text-xl text-gray-700 mb-3">No Sessions Found</h3>
            <p className="text-gray-600 mb-6">Import a Vision Session package to begin</p>
            <Link href="/import" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
              Import Package
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session: any) => {
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
  )
}
