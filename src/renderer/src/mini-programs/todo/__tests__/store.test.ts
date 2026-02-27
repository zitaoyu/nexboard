import { describe, it, expect, beforeEach } from 'vitest'
import { useTodoStore } from '../store'

describe('useTodoStore', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [] })
  })

  describe('initial state', () => {
    it('starts with an empty todos array', () => {
      expect(useTodoStore.getState().todos).toHaveLength(0)
    })
  })

  describe('addTodo', () => {
    it('adds a new todo item', () => {
      useTodoStore.getState().addTodo('Buy milk')
      expect(useTodoStore.getState().todos).toHaveLength(1)
    })

    it('assigns a non-empty string id', () => {
      useTodoStore.getState().addTodo('Buy milk')
      const { id } = useTodoStore.getState().todos[0]
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('trims whitespace from text', () => {
      useTodoStore.getState().addTodo('  Buy milk  ')
      expect(useTodoStore.getState().todos[0].text).toBe('Buy milk')
    })

    it('sets completed to false', () => {
      useTodoStore.getState().addTodo('Buy milk')
      expect(useTodoStore.getState().todos[0].completed).toBe(false)
    })

    it('records createdAt as a number', () => {
      useTodoStore.getState().addTodo('Buy milk')
      expect(typeof useTodoStore.getState().todos[0].createdAt).toBe('number')
    })

    it('accepts optional dueDate', () => {
      useTodoStore.getState().addTodo('Buy milk', { dueDate: '2026-03-01' })
      expect(useTodoStore.getState().todos[0].dueDate).toBe('2026-03-01')
    })

    it('accepts optional priority', () => {
      useTodoStore.getState().addTodo('Buy milk', { priority: 'high' })
      expect(useTodoStore.getState().todos[0].priority).toBe('high')
    })

    it('leaves dueDate undefined when not provided', () => {
      useTodoStore.getState().addTodo('Buy milk')
      expect(useTodoStore.getState().todos[0].dueDate).toBeUndefined()
    })

    it('appends todos in order', () => {
      useTodoStore.getState().addTodo('First')
      useTodoStore.getState().addTodo('Second')
      useTodoStore.getState().addTodo('Third')
      const texts = useTodoStore.getState().todos.map((t) => t.text)
      expect(texts).toEqual(['First', 'Second', 'Third'])
    })

    it('generates unique ids for each todo', () => {
      useTodoStore.getState().addTodo('A')
      useTodoStore.getState().addTodo('B')
      const ids = useTodoStore.getState().todos.map((t) => t.id)
      expect(ids[0]).not.toBe(ids[1])
    })
  })

  describe('removeTodo', () => {
    it('removes the todo with the matching id', () => {
      useTodoStore.getState().addTodo('Buy milk')
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().removeTodo(id)
      expect(useTodoStore.getState().todos).toHaveLength(0)
    })

    it('leaves other todos untouched', () => {
      useTodoStore.getState().addTodo('First')
      useTodoStore.getState().addTodo('Second')
      const firstId = useTodoStore.getState().todos[0].id
      useTodoStore.getState().removeTodo(firstId)
      expect(useTodoStore.getState().todos).toHaveLength(1)
      expect(useTodoStore.getState().todos[0].text).toBe('Second')
    })

    it('does nothing for an unknown id', () => {
      useTodoStore.getState().addTodo('Buy milk')
      useTodoStore.getState().removeTodo('nonexistent-id')
      expect(useTodoStore.getState().todos).toHaveLength(1)
    })

    it('is safe to call on an empty list', () => {
      expect(() => useTodoStore.getState().removeTodo('anything')).not.toThrow()
    })
  })

  describe('toggleTodo', () => {
    it('marks an incomplete todo as completed', () => {
      useTodoStore.getState().addTodo('Buy milk')
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().toggleTodo(id)
      expect(useTodoStore.getState().todos[0].completed).toBe(true)
    })

    it('marks a completed todo as incomplete', () => {
      useTodoStore.getState().addTodo('Buy milk')
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().toggleTodo(id) // false → true
      useTodoStore.getState().toggleTodo(id) // true → false
      expect(useTodoStore.getState().todos[0].completed).toBe(false)
    })

    it('does not affect other todos', () => {
      useTodoStore.getState().addTodo('First')
      useTodoStore.getState().addTodo('Second')
      const firstId = useTodoStore.getState().todos[0].id
      useTodoStore.getState().toggleTodo(firstId)
      expect(useTodoStore.getState().todos[1].completed).toBe(false)
    })

    it('does nothing for an unknown id', () => {
      useTodoStore.getState().addTodo('Buy milk')
      useTodoStore.getState().toggleTodo('ghost')
      expect(useTodoStore.getState().todos[0].completed).toBe(false)
    })
  })

  describe('updateTodo', () => {
    it('updates text', () => {
      useTodoStore.getState().addTodo('Old text')
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().updateTodo(id, { text: 'New text' })
      expect(useTodoStore.getState().todos[0].text).toBe('New text')
    })

    it('updates dueDate', () => {
      useTodoStore.getState().addTodo('Task')
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().updateTodo(id, { dueDate: '2026-04-01' })
      expect(useTodoStore.getState().todos[0].dueDate).toBe('2026-04-01')
    })

    it('updates priority', () => {
      useTodoStore.getState().addTodo('Task')
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().updateTodo(id, { priority: 'low' })
      expect(useTodoStore.getState().todos[0].priority).toBe('low')
    })

    it('merges patch without overwriting unrelated fields', () => {
      useTodoStore.getState().addTodo('Task', { dueDate: '2026-03-01', priority: 'medium' })
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().updateTodo(id, { priority: 'high' })
      const todo = useTodoStore.getState().todos[0]
      expect(todo.priority).toBe('high')
      expect(todo.dueDate).toBe('2026-03-01')
    })

    it('does not affect the completed flag', () => {
      useTodoStore.getState().addTodo('Task')
      const id = useTodoStore.getState().todos[0].id
      useTodoStore.getState().updateTodo(id, { text: 'Updated' })
      expect(useTodoStore.getState().todos[0].completed).toBe(false)
    })

    it('does nothing for an unknown id', () => {
      useTodoStore.getState().addTodo('Task')
      useTodoStore.getState().updateTodo('ghost', { text: 'Changed' })
      expect(useTodoStore.getState().todos[0].text).toBe('Task')
    })
  })
})
