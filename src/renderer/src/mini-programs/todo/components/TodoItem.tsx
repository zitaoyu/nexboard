import { useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import type { TodoItem as TodoItemType, Priority } from '../store'

interface Props {
  item: TodoItemType
  onToggle: () => void
  onRemove: () => void
  onUpdate: (patch: Partial<Pick<TodoItemType, 'text' | 'dueDate' | 'priority'>>) => void
}

function formatDueDate(dueDate: string): { label: string; className: string } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate + 'T00:00:00')
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000)

  if (diffDays < 0) {
    const d = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return { label: `${d} · overdue`, className: 'text-red-400 bg-red-400/10' }
  }
  if (diffDays === 0) return { label: 'Today', className: 'text-amber-400 bg-amber-400/10' }
  if (diffDays === 1) return { label: 'Tomorrow', className: 'text-white/50 bg-white/5' }
  const label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return { label, className: 'text-white/50 bg-white/5' }
}

const PRIORITY_STYLES: Record<string, string> = {
  high: 'text-red-400 bg-red-400/10',
  medium: 'text-amber-400 bg-amber-400/10',
  low: 'text-sky-400 bg-sky-400/10'
}

export function TodoItem({ item, onToggle, onRemove, onUpdate }: Props): React.ReactElement {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(item.text)
  const [editDueDate, setEditDueDate] = useState(item.dueDate ?? '')
  const [editPriority, setEditPriority] = useState<Priority | ''>(item.priority ?? '')

  const startEdit = (): void => {
    setEditText(item.text)
    setEditDueDate(item.dueDate ?? '')
    setEditPriority(item.priority ?? '')
    setEditing(true)
  }

  const saveEdit = (): void => {
    const trimmed = editText.trim()
    if (!trimmed) return
    onUpdate({
      text: trimmed,
      dueDate: editDueDate || undefined,
      priority: (editPriority as Priority) || undefined
    })
    setEditing(false)
  }

  const cancelEdit = (): void => setEditing(false)

  const due = item.dueDate ? formatDueDate(item.dueDate) : null

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-2">
        {/* Text input */}
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit()
            if (e.key === 'Escape') cancelEdit()
          }}
          autoFocus
          className="w-full bg-transparent text-sm text-white outline-none"
        />

        {/* Due date + priority */}
        <div className="flex gap-2">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs text-white/40">Due date</span>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="rounded bg-white/10 px-2 py-1 text-sm text-white outline-none [color-scheme:dark]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/40">Priority</span>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority | '')}
              className="rounded bg-gray-800 px-2 py-1 text-sm text-white outline-none"
            >
              <option value="" className="bg-gray-800 text-white">None</option>
              <option value="low" className="bg-gray-800 text-white">Low</option>
              <option value="medium" className="bg-gray-800 text-white">Medium</option>
              <option value="high" className="bg-gray-800 text-white">High</option>
            </select>
          </label>
        </div>

        {/* Save / Cancel */}
        <div className="flex justify-end gap-1">
          <button
            onClick={cancelEdit}
            className="rounded px-2 py-1 text-xs text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={13} />
          </button>
          <button
            onClick={saveEdit}
            disabled={!editText.trim()}
            className="flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs text-white transition-colors hover:bg-purple-500 disabled:opacity-30"
          >
            <Check size={13} /> Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-white/5">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          item.completed
            ? 'border-purple-500 bg-purple-500'
            : 'border-white/30 hover:border-purple-400'
        }`}
        aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {item.completed && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <span
          className={`block text-sm leading-snug ${item.completed ? 'text-white/30 line-through' : 'text-white/90'}`}
        >
          {item.text}
        </span>

        {/* Badges */}
        {(due || item.priority) && (
          <div className="mt-1 flex flex-wrap gap-1">
            {due && (
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${due.className}`}>
                {due.label}
              </span>
            )}
            {item.priority && (
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[item.priority]}`}
              >
                {item.priority}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Edit + Delete (visible on hover) */}
      <div className="mt-0.5 flex shrink-0 gap-0.5 text-white/0 transition-colors group-hover:text-white/30">
        <button
          onClick={startEdit}
          className="rounded p-0.5 transition-colors hover:!text-white/70"
          aria-label="Edit task"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onRemove}
          className="rounded p-0.5 transition-colors hover:!text-red-400"
          aria-label="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
