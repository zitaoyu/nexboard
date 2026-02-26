import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'

export type Priority = 'low' | 'medium' | 'high'

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
  dueDate?: string   // 'YYYY-MM-DD'
  priority?: Priority
}

interface TodoState {
  todos: TodoItem[]
  addTodo: (text: string, opts?: { dueDate?: string; priority?: Priority }) => void
  removeTodo: (id: string) => void
  toggleTodo: (id: string) => void
  updateTodo: (id: string, patch: Partial<Pick<TodoItem, 'text' | 'dueDate' | 'priority'>>) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text, opts = {}) => {
        const item: TodoItem = {
          id: uuid(),
          text: text.trim(),
          completed: false,
          createdAt: Date.now(),
          ...opts
        }
        set((state) => ({ todos: [...state.todos, item] }))
      },

      removeTodo: (id) => {
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }))
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        }))
      },

      updateTodo: (id, patch) => {
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...patch } : t))
        }))
      }
    }),
    { name: 'nexboard-todos' }
  )
)
