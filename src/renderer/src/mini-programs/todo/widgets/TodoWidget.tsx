import { useMemo } from 'react'
import { CheckCheck } from 'lucide-react'
import { useTodoStore } from '../store'
import type { TodoItem } from '../store'

function urgencyScore(item: TodoItem): number {
  const priorityWeight = { high: 0, medium: 1, low: 2, undefined: 3 }
  const pScore = priorityWeight[(item.priority ?? 'undefined') as keyof typeof priorityWeight]
  if (!item.dueDate) return 1000 + pScore * 10
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(item.dueDate + 'T00:00:00')
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000)
  return diffDays * 10 + pScore
}

function dueBadge(dueDate: string): { label: string; className: string } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate + 'T00:00:00')
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return { label: 'overdue', className: 'text-red-400' }
  if (diff === 0) return { label: 'today', className: 'text-amber-400' }
  return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), className: 'text-white/40' }
}

export function TodoWidget(): React.ReactElement {
  const todos = useTodoStore((s) => s.todos)
  const toggleTodo = useTodoStore((s) => s.toggleTodo)

  const pending = useMemo(
    () => todos.filter((t) => !t.completed).sort((a, b) => urgencyScore(a) - urgencyScore(b)),
    [todos]
  )

  if (pending.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 p-3 text-center">
        <CheckCheck size={26} className="text-purple-400" />
        <span className="text-sm text-white/40">All done!</span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      {/* Count */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{pending.length}</span>
        <span className="text-sm text-white/40">pending</span>
      </div>

      {/* Up to 3 most urgent */}
      <div className="flex flex-col gap-1.5 overflow-hidden">
        {pending.slice(0, 3).map((item) => {
          const badge = item.dueDate ? dueBadge(item.dueDate) : null
          return (
            <div key={item.id} className="flex items-center gap-1.5 overflow-hidden">
              <button
                onClick={() => toggleTodo(item.id)}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/30 transition-colors hover:border-purple-400"
                aria-label="Mark complete"
              />
              <span className="flex-1 truncate text-sm text-white/70">{item.text}</span>
              {badge && (
                <span className={`shrink-0 text-xs ${badge.className}`}>{badge.label}</span>
              )}
            </div>
          )
        })}
        {pending.length > 3 && (
          <span className="text-xs text-white/30">+{pending.length - 3} more</span>
        )}
      </div>
    </div>
  )
}
