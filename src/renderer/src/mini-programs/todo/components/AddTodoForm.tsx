import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import type { Priority } from '../store'

interface Props {
  onAdd: (text: string, opts: { dueDate?: string; priority?: Priority }) => void
}

export function AddTodoForm({ onAdd }: Props): React.ReactElement {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [expanded, setExpanded] = useState(false)

  const submit = (): void => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, {
      dueDate: dueDate || undefined,
      priority: (priority as Priority) || undefined
    })
    setText('')
    setDueDate('')
    setPriority('')
    setExpanded(false)
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      {/* Main input row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
        />
        <button
          onClick={() => setExpanded((v) => !v)}
          className="rounded p-1 text-white/30 transition-colors hover:text-white/60"
          title="More options"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="rounded-lg bg-purple-600 p-1.5 text-white transition-colors hover:bg-purple-500 disabled:opacity-30"
          title="Add task"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Optional fields */}
      {expanded && (
        <div className="mt-2 flex gap-2 border-t border-white/10 pt-2">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs text-white/40">Due date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded bg-white/10 px-2 py-1 text-sm text-white outline-none [color-scheme:dark]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/40">Priority</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority | '')}
              className="rounded bg-gray-800 px-2 py-1 text-sm text-white outline-none"
            >
              <option value="" className="bg-gray-800 text-white">No priority</option>
              <option value="low" className="bg-gray-800 text-white">Low</option>
              <option value="medium" className="bg-gray-800 text-white">Medium</option>
              <option value="high" className="bg-gray-800 text-white">High</option>
            </select>
          </label>
        </div>
      )}
    </div>
  )
}
