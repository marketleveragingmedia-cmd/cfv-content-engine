import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatSessionTitle } from '@/lib/format-session-title'
import DeleteSessionButton from './DeleteSessionButton'

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
  
  const sessions = await prisma.visionSession.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      checklistItems: true,
      _count: { select: { assets: true } }
    }
  })
  
  return sessions
}

function calculateCompletion(checklistItems: any[]) {
  if (checklistItems.length === 0) return 0
  const completed = checklistItems.filter(item => item.completed).length
  return Math.round((completed / checklistItems.length) * 100)
}

export default async function SessionsPage({ searchParams }: { searchParams: any }) {
  let sessions
  try {
    sessions = await getSessions(searchParams)
  } catch (error: any) {
    console.error('[SessionsPage] Error loading sessions:', error)
    return (
      <div className="min-h-screen bg-[#fdfbf7] p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Database Connection Error</h1>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{error.message || String(error)}</pre>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen py-4 md:py-8 px-2 md:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-8 mb-4 md:mb-6">
          <Link 
            href="/"
            className="inline-block mb-4 md:mb-6 font-semibold hover:underline cursor-pointer text-sm md:text-base"
            style={{color: 'var(--green-primary)'}}
          >
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold" style={{color: 'var(--green-primary)'}}>All Vision Sessions</h1>
            <Link 
              href="/import" 
              className="px-5 py-2.5 text-white rounded-lg font-semibold transition shadow-sm hover:shadow-md text-center text-sm md:text-base"
              style={{background: 'linear-gradient(135deg, #2D8659 0%, #1F7A47 100%)'}}
            >
              + Import New
            </Link>
          </div>
        </div>
        
        {/* Navigation Card */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-6">
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg font-semibold transition text-center text-sm md:text-base"
              style={{color: 'var(--green-primary)', border: '2px solid var(--green-primary)'}}
            >
              📊 Dashboard
            </Link>
            <Link 
              href="/import" 
              className="px-4 py-2 rounded-lg font-semibold transition text-center text-sm md:text-base"
              style={{color: 'var(--green-primary)', border: '2px solid var(--green-primary)'}}
            >
              📥 Import Package
            </Link>
            <Link 
              href="/sessions" 
              className="px-4 py-2 text-white rounded-lg font-semibold text-center text-sm md:text-base"
              style={{background: 'var(--green-primary)'}}
            >
              📁 All Sessions
            </Link>
          </nav>
        </div>
        
        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <select className="px-4 py-2 bg-white border rounded-lg text-sm md:text-base" style={{borderColor: 'var(--border-color)'}}>
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="ready-for-review">Ready for Review</option>
            <option value="ready-to-publish">Ready to Publish</option>
            <option value="published">Published</option>
            </select>
            
            <select className="px-4 py-2 bg-white border rounded-lg text-sm md:text-base" style={{borderColor: 'var(--border-color)'}}>
            <option value="">All Stages</option>
            <option value="Foundation">Foundation</option>
            <option value="Founder Warm-Up">Founder Warm-Up</option>
            <option value="Founder Education">Founder Education</option>
            <option value="Founder Invitation">Founder Invitation</option>
            </select>
            
            <input type="text" placeholder="Search sessions..." className="flex-1 px-4 py-2 bg-white border rounded-lg text-sm md:text-base" style={{borderColor: 'var(--border-color)'}} />
          </div>
        </div>
        
        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl mb-3" style={{color: 'var(--text-primary)'}}>No Sessions Found</h3>
              <p className="mb-6" style={{color: 'var(--text-secondary)'}}>Import a Vision Session package to begin</p>
              <Link 
                href="/import" 
                className="inline-block px-5 py-2.5 text-white rounded-lg font-semibold transition shadow-sm"
                style={{background: 'linear-gradient(135deg, #2D8659 0%, #1F7A47 100%)'}}
              >
                Import Package
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session: any) => {
              const completion = calculateCompletion(session.checklistItems)
              return (
                <div 
                  key={session.id} 
                  className="border rounded-xl p-6 hover:shadow-lg transition"
                  style={{borderColor: 'var(--border-color)'}}
                >
                  <Link href={`/session/${session.id}`} className="block">
                    <div className="font-semibold mb-2" style={{color: 'var(--green-primary)'}}>{session.sessionId}</div>
                    <h3 className="text-lg font-bold mb-3" style={{color: 'var(--text-primary)'}}>{formatSessionTitle(session)}</h3>
                    
                    <div className="flex gap-4 text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
                      <span>📂 {session.category || 'Uncategorized'}</span>
                      <span>🎯 {session.founderPathwayStage || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs" style={{color: 'var(--text-secondary)'}}>{session._count.assets} assets</span>
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
                      <div className="h-full transition-all" style={{ width: `${completion}%`, background: 'var(--green-primary)' }} />
                    </div>
                    <div className="text-xs mb-3" style={{color: 'var(--text-secondary)'}}>{completion}% Complete</div>
                  </Link>
                  
                  <div className="pt-3 border-t" style={{borderColor: 'var(--border-color)'}}>
                    <DeleteSessionButton 
                      sessionId={session.id} 
                      sessionTitle={formatSessionTitle(session)} 
                    />
                  </div>
                </div>
              )
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// Cache bust Fri Jul  3 16:40:27 UTC 2026
