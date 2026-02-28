import { describe, it, expect } from 'vitest'
import { widgetRegistry } from '../registry'

describe('widgetRegistry', () => {
  describe('built-in registrations', () => {
    it('contains built-in:clock', () => {
      expect(widgetRegistry.get('built-in:clock')).toBeDefined()
    })

    it('contains built-in:timer', () => {
      expect(widgetRegistry.get('built-in:timer')).toBeDefined()
    })

    it('contains built-in:photo', () => {
      expect(widgetRegistry.get('built-in:photo')).toBeDefined()
    })

    it('getAll includes all three built-in widgets', () => {
      const ids = widgetRegistry.getAll().map((d) => d.manifest.id)
      expect(ids).toContain('built-in:clock')
      expect(ids).toContain('built-in:timer')
      expect(ids).toContain('built-in:photo')
    })
  })

  describe('get', () => {
    it('returns the correct manifest for built-in:clock', () => {
      const def = widgetRegistry.get('built-in:clock')!
      expect(def.manifest.id).toBe('built-in:clock')
      expect(def.manifest.name).toBe('Clock')
      expect(def.manifest.defaultSize).toEqual({ w: 3, h: 2 })
      expect(def.manifest.sourceProgram).toBeNull()
    })

    it('has Component and SettingsComponent functions on built-in:clock', () => {
      const def = widgetRegistry.get('built-in:clock')!
      expect(typeof def.Component).toBe('function')
      expect(typeof def.SettingsComponent).toBe('function')
    })

    it('returns undefined for an unknown id', () => {
      expect(widgetRegistry.get('nonexistent:widget')).toBeUndefined()
    })
  })

  describe('register', () => {
    it('registers a new widget and makes it retrievable', () => {
      widgetRegistry.register({
        manifest: {
          id: 'test:new-widget',
          name: 'Test Widget',
          description: 'For testing',
          defaultSize: { w: 2, h: 2 },
          sourceProgram: null,
        },
        Component: () => null,
      })
      expect(widgetRegistry.get('test:new-widget')).toBeDefined()
    })

    it('overwrites an existing entry when re-registered with same id', () => {
      widgetRegistry.register({
        manifest: {
          id: 'test:overwrite',
          name: 'Original',
          description: '',
          defaultSize: { w: 1, h: 1 },
          sourceProgram: null,
        },
        Component: () => null,
      })
      widgetRegistry.register({
        manifest: {
          id: 'test:overwrite',
          name: 'Updated',
          description: '',
          defaultSize: { w: 2, h: 2 },
          sourceProgram: null,
        },
        Component: () => null,
      })
      expect(widgetRegistry.get('test:overwrite')!.manifest.name).toBe('Updated')
    })

    it('newly registered widget appears in getAll', () => {
      widgetRegistry.register({
        manifest: {
          id: 'test:in-getall',
          name: 'In GetAll',
          description: '',
          defaultSize: { w: 1, h: 1 },
          sourceProgram: null,
        },
        Component: () => null,
      })
      const ids = widgetRegistry.getAll().map((d) => d.manifest.id)
      expect(ids).toContain('test:in-getall')
    })
  })

  describe('getAll', () => {
    it('returns an array', () => {
      expect(Array.isArray(widgetRegistry.getAll())).toBe(true)
    })

    it('every entry has a manifest with an id string', () => {
      for (const def of widgetRegistry.getAll()) {
        expect(typeof def.manifest.id).toBe('string')
      }
    })
  })
})
