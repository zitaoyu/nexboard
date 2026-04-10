import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Priority } from '../store'

interface Props {
  onAdd: (text: string, opts: { dueDate?: string; priority?: Priority }) => void
}

export function AddTodoForm({ onAdd }: Props): React.ReactElement {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')

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
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      {/* Main input row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-base text-white placeholder-white/30 outline-none"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="rounded-lg bg-purple-600 p-2 text-white transition-colors hover:bg-purple-500 disabled:opacity-30"
          title="Add task"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Always-visible date + priority */}
      <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm text-white/40">Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded bg-white/10 px-2 py-1.5 text-base text-white outline-none [color-scheme:dark]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-white/40">Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority | '')}
            className="rounded bg-gray-800 px-2 py-1.5 text-base text-white outline-none"
          >
            <option value="" className="bg-gray-800 text-white">No priority</option>
            <option value="low" className="bg-gray-800 text-white">Low</option>
            <option value="medium" className="bg-gray-800 text-white">Medium</option>
            <option value="high" className="bg-gray-800 text-white">High</option>
          </select>
        </label>
      </div>
    </div>
  )
}
