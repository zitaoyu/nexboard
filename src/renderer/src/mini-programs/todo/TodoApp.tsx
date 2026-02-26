import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useTodoStore } from './store'
import { AddTodoForm } from './components/AddTodoForm'
import { TodoItem } from './components/TodoItem'
import type { Priority, TodoItem as TodoItemType } from './store'

function urgencyScore(item: TodoItemType): number {
  // Lower score = more urgent (sort ascending)
  const priorityWeight = { high: 0, medium: 1, low: 2, undefined: 3 }
  const pScore = priorityWeight[(item.priority ?? 'undefined') as keyof typeof priorityWeight]

  if (!item.dueDate) return 1000 + pScore * 10 + (item.createdAt % 10000) / 10000

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(item.dueDate + 'T00:00:00')
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000)

  // Overdue items come first (negative diffDays), then by priority
  return diffDays * 10 + pScore
}

export function TodoApp(): React.ReactElement {
  const { todos, addTodo, removeTodo, toggleTodo, updateTodo } = useTodoStore()
  const [completedOpen, setCompletedOpen] = useState(true)

  const pending = useMemo(
    () => todos.filter((t) => !t.completed).sort((a, b) => urgencyScore(a) - urgencyScore(b)),
    [todos]
  )

  const completed = useMemo(
    () =>
      todos
        .filter((t) => t.completed)
        .sort((a, b) => b.createdAt - a.createdAt),
    [todos]
  )

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto">
      <AddTodoForm
        onAdd={(text, opts) => addTodo(text, opts as { dueDate?: string; priority?: Priority })}
      />

      {/* Pending section */}
      <section>
        <h2 className="mb-1.5 flex items-center gap-1.5 px-1 text-sm font-semibold text-white/50 uppercase tracking-wider">
          Todo
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-xs font-normal normal-case tracking-normal text-white/60">
            {pending.length}
          </span>
        </h2>

        {pending.length === 0 ? (
          <p className="px-2 py-3 text-center text-sm text-white/30">No pending tasks</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {pending.map((item) => (
              <TodoItem
                key={item.id}
                item={item}
                onToggle={() => toggleTodo(item.id)}
                onRemove={() => removeTodo(item.id)}
                onUpdate={(patch) => updateTodo(item.id, patch)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completed section */}
      <section>
        <button
          onClick={() => setCompletedOpen((v) => !v)}
          className="mb-1.5 flex w-full items-center gap-1.5 px-1 text-sm font-semibold text-white/50 uppercase tracking-wider hover:text-white/70"
        >
          {completedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          Completed
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-xs font-normal normal-case tracking-normal text-white/60">
            {completed.length}
          </span>
        </button>

        {completedOpen && (
          <>
            {completed.length === 0 ? (
              <p className="px-2 py-3 text-center text-sm text-white/30">Nothing completed yet</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {completed.map((item) => (
                  <TodoItem
                    key={item.id}
                    item={item}
                    onToggle={() => toggleTodo(item.id)}
                    onRemove={() => removeTodo(item.id)}
                    onUpdate={(patch) => updateTodo(item.id, patch)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
