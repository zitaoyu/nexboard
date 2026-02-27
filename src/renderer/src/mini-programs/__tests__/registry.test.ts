import { describe, it, expect } from 'vitest'
import { miniProgramRegistry } from '../registry'
import { widgetRegistry } from '@/widgets/registry'

describe('miniProgramRegistry', () => {
  describe('built-in registrations', () => {
    it('contains stock-tracker', () => {
      expect(miniProgramRegistry.get('stock-tracker')).toBeDefined()
    })

    it('contains todo', () => {
      expect(miniProgramRegistry.get('todo')).toBeDefined()
    })

    it('getAll includes both built-in programs', () => {
      const ids = miniProgramRegistry.getAll().map((p) => p.manifest.id)
      expect(ids).toContain('stock-tracker')
      expect(ids).toContain('todo')
    })
  })

  describe('get', () => {
    it('returns correct manifest for stock-tracker', () => {
      const def = miniProgramRegistry.get('stock-tracker')!
      expect(def.manifest.id).toBe('stock-tracker')
      expect(def.manifest.name).toBe('Stock Tracker')
      expect(def.manifest.color).toBe('#22c55e')
    })

    it('returns correct color for todo', () => {
      const def = miniProgramRegistry.get('todo')!
      expect(def.manifest.color).toBe('#a855f7')
    })

    it('returns undefined for an unknown id', () => {
      expect(miniProgramRegistry.get('nonexistent')).toBeUndefined()
    })

    it('has an AppComponent function on stock-tracker', () => {
      const def = miniProgramRegistry.get('stock-tracker')!
      expect(typeof def.AppComponent).toBe('function')
    })

    it('has a non-empty widgets array on stock-tracker', () => {
      const def = miniProgramRegistry.get('stock-tracker')!
      expect(Array.isArray(def.widgets)).toBe(true)
      expect(def.widgets.length).toBeGreaterThan(0)
    })
  })

  describe('widget auto-forwarding', () => {
    it('auto-registers stock-tracker:ticker into widgetRegistry', () => {
      expect(widgetRegistry.get('stock-tracker:ticker')).toBeDefined()
    })

    it('auto-registers todo:summary into widgetRegistry', () => {
      expect(widgetRegistry.get('todo:summary')).toBeDefined()
    })

    it('stock-tracker:ticker has sourceProgram = "stock-tracker"', () => {
      expect(widgetRegistry.get('stock-tracker:ticker')!.manifest.sourceProgram).toBe('stock-tracker')
    })

    it('todo:summary has sourceProgram = "todo"', () => {
      expect(widgetRegistry.get('todo:summary')!.manifest.sourceProgram).toBe('todo')
    })

    it('register() auto-forwards widgets from a custom program', () => {
      miniProgramRegistry.register({
        manifest: {
          id: 'test-program',
          name: 'Test Program',
          description: 'for testing',
          icon: 'Star',
          color: '#ff0000',
        },
        AppComponent: () => null,
        widgets: [
          {
            manifest: {
              id: 'test-program:my-widget',
              name: 'My Widget',
              description: '',
              defaultSize: { w: 2, h: 2 },
              sourceProgram: 'test-program',
            },
            Component: () => null,
          },
        ],
      })
      expect(widgetRegistry.get('test-program:my-widget')).toBeDefined()
    })
  })

  describe('getAll', () => {
    it('returns an array', () => {
      expect(Array.isArray(miniProgramRegistry.getAll())).toBe(true)
    })

    it('every entry has a manifest with id and color', () => {
      for (const def of miniProgramRegistry.getAll()) {
        expect(typeof def.manifest.id).toBe('string')
        expect(typeof def.manifest.color).toBe('string')
      }
    })
  })
})
