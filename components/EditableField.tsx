'use client'

import { useState } from 'react'

interface EditableFieldProps {
  sessionId: string
  field: string
  value: string | null
  label: string
  type?: 'text' | 'select' | 'textarea'
  options?: string[]
  placeholder?: string
}

export function EditableField({ 
  sessionId, 
  field, 
  value, 
  label, 
  type = 'text',
  options = [],
  placeholder = 'Not set'
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/session/${sessionId}/update-field`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: currentValue })
      })

      if (!response.ok) {
        throw new Error('Failed to update field')
      }

      setIsEditing(false)
      // Reload page to refresh data
      window.location.reload()
    } catch (error) {
      console.error('Error updating field:', error)
      alert('Failed to update. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setCurrentValue(value || '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
          {label}
        </label>
        <div className="flex gap-2">
          {type === 'select' && options.length > 0 ? (
            <select
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ borderColor: '#1E8E5A' }}
              disabled={saving}
            >
              <option value="">{placeholder}</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ borderColor: '#1E8E5A' }}
              rows={3}
              disabled={saving}
            />
          ) : (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ borderColor: '#1E8E5A' }}
              disabled={saving}
            />
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            style={{ background: '#1E8E5A' }}
          >
            {saving ? '...' : '✓'}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div 
        className="group flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-green-500 cursor-pointer transition"
        onClick={() => setIsEditing(true)}
      >
        <span className="flex-1 text-gray-900 font-semibold">
          {currentValue || <span className="text-gray-400 italic">{placeholder}</span>}
        </span>
        <span className="text-gray-400 group-hover:text-green-600 transition">✏️ Edit</span>
      </div>
    </div>
  )
}
