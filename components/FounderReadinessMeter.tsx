'use client'

interface FounderReadinessMeterProps {
  sessions: any[]
}

export function FounderReadinessMeter({ sessions }: FounderReadinessMeterProps) {
  // Count published sessions by Founder Pathway Stage
  const publishedSessions = sessions.filter(s => s.status === 'published')
  
  const foundationPublished = publishedSessions.filter(s => 
    s.founderPathwayStage === 'Foundation'
  ).length
  
  const warmUpPublished = publishedSessions.filter(s => 
    s.founderPathwayStage === 'Founder Warm-Up'
  ).length
  
  const educationPublished = publishedSessions.filter(s => 
    s.founderPathwayStage === 'Founder Education'
  ).length
  
  const invitationPublished = publishedSessions.filter(s => 
    s.founderPathwayStage === 'Founder Invitation'
  ).length

  // Determine current recommendation
  const getRecommendation = () => {
    if (foundationPublished < 5) {
      return {
        text: 'Continue Foundation Content',
        description: 'Build a strong foundation with 5-10 Foundation Vision Sessions before moving to Warm-Up content.',
        color: 'text-blue-800',
        bg: 'bg-blue-50',
        border: 'border-blue-300'
      }
    }
    
    if (warmUpPublished < 3) {
      return {
        text: 'Continue Foundation + Add Warm-Up Content',
        description: 'Foundation is established. Start introducing Founder Warm-Up content to prepare the community.',
        color: 'text-yellow-800',
        bg: 'bg-yellow-50',
        border: 'border-yellow-300'
      }
    }
    
    if (educationPublished < 3) {
      return {
        text: 'Founder Education Can Begin',
        description: 'Community is warmed up. Begin Founder Education content to teach the Founder Pathway.',
        color: 'text-purple-800',
        bg: 'bg-purple-50',
        border: 'border-purple-300'
      }
    }
    
    if (invitationPublished < 1) {
      return {
        text: 'Ready for Founder Invitations',
        description: 'Community is educated. Begin Founder Invitation content to activate Founders.',
        color: 'text-green-800',
        bg: 'bg-green-50',
        border: 'border-green-300'
      }
    }
    
    return {
      text: 'Full Founder Pathway Active',
      description: 'All pathway stages active. Continue balanced content across all stages.',
      color: 'text-green-900',
      bg: 'bg-green-100',
      border: 'border-green-400'
    }
  }

  const recommendation = getRecommendation()

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2" style={{borderColor: '#1E8E5A'}}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{color: '#1E8E5A'}}>
          🎯 Founder Readiness Meter
        </h2>
        <span className="text-sm text-gray-500">Published Content Only</span>
      </div>

      {/* Pathway Stage Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <PathwayCard 
          stage="Foundation"
          count={foundationPublished}
          color="blue"
          icon="🏗️"
        />
        <PathwayCard 
          stage="Founder Warm-Up"
          count={warmUpPublished}
          color="yellow"
          icon="🔥"
        />
        <PathwayCard 
          stage="Founder Education"
          count={educationPublished}
          color="purple"
          icon="🎓"
        />
        <PathwayCard 
          stage="Founder Invitation"
          count={invitationPublished}
          color="green"
          icon="✨"
        />
      </div>

      {/* Current Recommendation */}
      <div className={`${recommendation.bg} border-2 ${recommendation.border} rounded-lg p-4`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${recommendation.color} mb-1`}>
              {recommendation.text}
            </h3>
            <p className="text-sm text-gray-700">
              {recommendation.description}
            </p>
          </div>
        </div>
      </div>

      {/* Pathway Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Pathway Progress</span>
          <span className="text-sm text-gray-500">
            {foundationPublished + warmUpPublished + educationPublished + invitationPublished} published
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-blue-500 transition-all"
            style={{width: `${(foundationPublished / Math.max(foundationPublished + warmUpPublished + educationPublished + invitationPublished, 1)) * 100}%`}}
            title="Foundation"
          />
          <div 
            className="h-full bg-yellow-500 transition-all"
            style={{width: `${(warmUpPublished / Math.max(foundationPublished + warmUpPublished + educationPublished + invitationPublished, 1)) * 100}%`}}
            title="Warm-Up"
          />
          <div 
            className="h-full bg-purple-500 transition-all"
            style={{width: `${(educationPublished / Math.max(foundationPublished + warmUpPublished + educationPublished + invitationPublished, 1)) * 100}%`}}
            title="Education"
          />
          <div 
            className="h-full bg-green-500 transition-all"
            style={{width: `${(invitationPublished / Math.max(foundationPublished + warmUpPublished + educationPublished + invitationPublished, 1)) * 100}%`}}
            title="Invitation"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Foundation</span>
          <span>Warm-Up</span>
          <span>Education</span>
          <span>Invitation</span>
        </div>
      </div>
    </div>
  )
}

function PathwayCard({ stage, count, color, icon }: { stage: string; count: number; color: string; icon: string }) {
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-900', num: 'text-blue-700' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-900', num: 'text-yellow-700' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-900', num: 'text-purple-700' },
    green: { bg: 'bg-green-100', text: 'text-green-900', num: 'text-green-700' },
  }

  const colors = colorMap[color as keyof typeof colorMap]

  return (
    <div className={`${colors.bg} border border-gray-200 rounded-lg p-4`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-3xl font-bold ${colors.num} mb-1`}>{count}</div>
      <div className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
        {stage}
      </div>
    </div>
  )
}
