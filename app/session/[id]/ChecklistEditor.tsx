'use client'

export function ChecklistEditor({ item }: { item: any }) {
  const handleToggle = async () => {
    await fetch(`/api/checklist/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !item.completed, status: !item.completed ? 'Approved' : 'Not Started' })
    })
    window.location.reload()
  }
  
  const handleStatusChange = async (status: string) => {
    await fetch(`/api/checklist/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    window.location.reload()
  }
  
  return (
    <div className="flex items-center gap-3">
      <input type="checkbox" checked={item.completed} onChange={handleToggle} />
      <span className={item.completed ? 'line-through text-gray-500' : ''}>{item.title}</span>
      {item.required && <span className="text-red-500">*</span>}
      <select value={item.status} onChange={(e) => handleStatusChange(e.target.value)} className="ml-auto px-2 py-1 bg-gray-800 rounded text-xs">
        <option>Not Started</option>
        <option>In Progress</option>
        <option>Ready for Review</option>
        <option>Approved</option>
        <option>Scheduled</option>
        <option>Published</option>
        <option>Skipped</option>
        <option>Blocked</option>
      </select>
    </div>
  )
}
