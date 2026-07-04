'use client'

import { useState } from 'react'
import { ChecklistEditor } from './ChecklistEditor'

interface EnhancedChecklistProps {
  session: any
}

export function EnhancedChecklist({ session }: EnhancedChecklistProps) {
  const categories = [...new Set(session.checklistItems.map((i: any) => i.category))] as string[]
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set([categories[0]]))

  const toggleGroup = (category: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedGroups(newExpanded)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{color: '#1E8E5A'}}>Publishing Checklist</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded uppercase">Required</span>
            <span className="text-gray-600">Must complete to publish</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded uppercase">Optional</span>
            <span className="text-gray-600">Recommended but not required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded uppercase">Founder Review</span>
            <span className="text-gray-600">Requires founder approval</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const items = session.checklistItems.filter((i: any) => i.category === category)
          const completed = items.filter((i: any) => i.completed).length
          const required = items.filter((i: any) => i.required).length
          const requiredCompleted = items.filter((i: any) => i.required && i.completed).length
          const total = items.length
          const percentage = Math.round((completed / total) * 100)
          const isExpanded = expandedGroups.has(category)

          // Determine group status
          let groupStatus = 'Not Started'
          let statusColor = 'text-gray-600'
          let statusBg = 'bg-gray-100'
          
          if (completed === total) {
            groupStatus = 'Complete'
            statusColor = 'text-green-800'
            statusBg = 'bg-green-100'
          } else if (requiredCompleted === required && required > 0) {
            groupStatus = 'Required Complete'
            statusColor = 'text-blue-800'
            statusBg = 'bg-blue-100'
          } else if (completed > 0) {
            groupStatus = 'In Progress'
            statusColor = 'text-yellow-800'
            statusBg = 'bg-yellow-100'
          }

          return (
            <div key={category} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(category)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">
                        {completed} / {total} tasks complete
                      </span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm font-semibold" style={{color: '#1E8E5A'}}>
                        {requiredCompleted} / {required} required
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-48 hidden lg:block">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          background: percentage >= 100 ? '#1E8E5A' : percentage >= 50 ? '#C9A441' : '#94a3b8'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 ${statusBg} ${statusColor} text-xs font-bold rounded-full uppercase whitespace-nowrap`}>
                    {groupStatus}
                  </span>
                </div>
              </button>

              {/* Group Content */}
              {isExpanded && (
                <div className="border-t-2 border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2">
                    {items.map((item: any) => (
                      <ChecklistItemRow key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChecklistItemRow({ item }: { item: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-1">
          <ChecklistEditor item={item} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            <div className="flex gap-2 flex-shrink-0">
              {item.required && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded uppercase">
                  Required
                </span>
              )}
              {!item.required && !item.conditional && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded uppercase">
                  Optional
                </span>
              )}
              {item.conditional && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded uppercase">
                  Conditional
                </span>
              )}
              {item.founderReview && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded uppercase">
                  Founder Review
                </span>
              )}
            </div>
          </div>
          
          {item.description && (
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm">
            <StatusBadge status={item.status} />
            {item.assignedTo && (
              <span className="text-gray-600">
                <strong>Assigned:</strong> {item.assignedTo}
              </span>
            )}
            {item.dueDate && (
              <span className="text-gray-600">
                <strong>Due:</strong> {new Date(item.dueDate).toLocaleDateString()}
              </span>
            )}
            {item.liveUrl && (
              <a 
                href={item.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                View Live →
              </a>
            )}
          </div>
          
          {item.status === 'Blocked' && item.blockReason && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-900">
                <strong>⚠️ Blocked:</strong> {item.blockReason}
              </p>
            </div>
          )}
          
          {item.notes && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-gray-700">
                <strong>Notes:</strong> {item.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    'Not Started': { bg: 'bg-gray-100', text: 'text-gray-700' },
    'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Ready for Review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'Approved': { bg: 'bg-green-100', text: 'text-green-800' },
    'Scheduled': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'Published': { bg: 'bg-green-200', text: 'text-green-900' },
    'Skipped': { bg: 'bg-gray-200', text: 'text-gray-600' },
    'Blocked': { bg: 'bg-red-100', text: 'text-red-800' },
  }

  const config = statusConfig[status] || statusConfig['Not Started']

  return (
    <span className={`px-3 py-1 ${config.bg} ${config.text} text-xs font-bold rounded-full uppercase`}>
      {status}
    </span>
  )
}
