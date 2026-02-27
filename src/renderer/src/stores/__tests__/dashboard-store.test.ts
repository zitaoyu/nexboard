import { describe, it, expect, beforeEach } from 'vitest'
// Side-effect import: populates widgetRegistry with stock-tracker:ticker, todo:summary
// (and transitively built-in:clock, built-in:timer) before any addWidget call.
import '@/mini-programs/registry'
import { useDashboardStore } from '../dashboard-store'

describe('dashboard-store', () => {
  beforeEach(() => {
    useDashboardStore.setState({ widgets: [] })
  })

  describe('addWidget', () => {
    it('adds a widget instance for a known widgetId', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      expect(useDashboardStore.getState().widgets).toHaveLength(1)
    })

    it('sets widgetId correctly', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      expect(useDashboardStore.getState().widgets[0].widgetId).toBe('built-in:clock')
    })

    it('assigns a non-empty string instanceId', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const id = useDashboardStore.getState().widgets[0].instanceId
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('uses defaultSize from manifest for layout w and h', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const { layout } = useDashboardStore.getState().widgets[0]
      expect(layout.w).toBe(3)
      expect(layout.h).toBe(2)
    })

    it('places new widgets at y=Infinity (bottom)', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      expect(useDashboardStore.getState().widgets[0].layout.y).toBe(Infinity)
    })

    it('applies minSize from manifest to layout', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const { layout } = useDashboardStore.getState().widgets[0]
      expect(layout.minW).toBe(2)
      expect(layout.minH).toBe(2)
    })

    it('applies maxSize from manifest to layout', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const { layout } = useDashboardStore.getState().widgets[0]
      expect(layout.maxW).toBe(6)
      expect(layout.maxH).toBe(4)
    })

    it('initialises config as empty object', () => {
      useDashboardStore.getState().addWidget('built-in:timer')
      expect(useDashboardStore.getState().widgets[0].config).toEqual({})
    })

    it('does nothing for an unknown widgetId', () => {
      useDashboardStore.getState().addWidget('nonexistent:widget')
      expect(useDashboardStore.getState().widgets).toHaveLength(0)
    })

    it('generates distinct instanceIds for multiple widgets of the same type', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      useDashboardStore.getState().addWidget('built-in:clock')
      const ids = useDashboardStore.getState().widgets.map((w) => w.instanceId)
      expect(ids[0]).not.toBe(ids[1])
    })

    it('works for mini-program widget stock-tracker:ticker', () => {
      useDashboardStore.getState().addWidget('stock-tracker:ticker')
      expect(useDashboardStore.getState().widgets[0].widgetId).toBe('stock-tracker:ticker')
    })

    it('works for mini-program widget todo:summary', () => {
      useDashboardStore.getState().addWidget('todo:summary')
      expect(useDashboardStore.getState().widgets[0].widgetId).toBe('todo:summary')
    })
  })

  describe('removeWidget', () => {
    it('removes the widget with the matching instanceId', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const id = useDashboardStore.getState().widgets[0].instanceId
      useDashboardStore.getState().removeWidget(id)
      expect(useDashboardStore.getState().widgets).toHaveLength(0)
    })

    it('leaves other widgets untouched', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      useDashboardStore.getState().addWidget('built-in:timer')
      const firstId = useDashboardStore.getState().widgets[0].instanceId
      useDashboardStore.getState().removeWidget(firstId)
      expect(useDashboardStore.getState().widgets).toHaveLength(1)
      expect(useDashboardStore.getState().widgets[0].widgetId).toBe('built-in:timer')
    })

    it('does nothing for an unknown instanceId', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      useDashboardStore.getState().removeWidget('ghost-id')
      expect(useDashboardStore.getState().widgets).toHaveLength(1)
    })

    it('is safe to call on empty store', () => {
      expect(() => useDashboardStore.getState().removeWidget('anything')).not.toThrow()
    })
  })

  describe('updateWidgetConfig', () => {
    it('merges new keys into config', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const id = useDashboardStore.getState().widgets[0].instanceId
      useDashboardStore.getState().updateWidgetConfig(id, { use24h: true })
      expect(useDashboardStore.getState().widgets[0].config).toEqual({ use24h: true })
    })

    it('accumulates keys across multiple calls', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const id = useDashboardStore.getState().widgets[0].instanceId
      useDashboardStore.getState().updateWidgetConfig(id, { use24h: true })
      useDashboardStore.getState().updateWidgetConfig(id, { showSeconds: false })
      expect(useDashboardStore.getState().widgets[0].config).toEqual({
        use24h: true,
        showSeconds: false,
      })
    })

    it('overwrites an existing key', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      const id = useDashboardStore.getState().widgets[0].instanceId
      useDashboardStore.getState().updateWidgetConfig(id, { use24h: true })
      useDashboardStore.getState().updateWidgetConfig(id, { use24h: false })
      expect(useDashboardStore.getState().widgets[0].config.use24h).toBe(false)
    })

    it('does not affect other widget instances', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      useDashboardStore.getState().addWidget('built-in:timer')
      const firstId = useDashboardStore.getState().widgets[0].instanceId
      useDashboardStore.getState().updateWidgetConfig(firstId, { use24h: true })
      expect(useDashboardStore.getState().widgets[1].config).toEqual({})
    })

    it('does nothing for an unknown instanceId', () => {
      useDashboardStore.getState().addWidget('built-in:clock')
      useDashboardStore.getState().updateWidgetConfig('ghost-id', { foo: 'bar' })
      expect(useDashboardStore.getState().widgets[0].config).toEqual({})
    })
  })

  describe('updateLayout', () => {
    it('updates x, y, w, h for a matching widget', () => {
      useDashboardStore.setState({
        widgets: [{ instanceId: 'w1', widgetId: 'built-in:clock', config: {}, layout: { x: 0, y: 0, w: 3, h: 2 } }],
      })
      useDashboardStore.getState().updateLayout([{ i: 'w1', x: 2, y: 3, w: 4, h: 5 }])
      const { layout } = useDashboardStore.getState().widgets[0]
      expect(layout).toMatchObject({ x: 2, y: 3, w: 4, h: 5 })
    })

    it('preserves widgets not included in the layout update', () => {
      useDashboardStore.setState({
        widgets: [
          { instanceId: 'w1', widgetId: 'built-in:clock', config: {}, layout: { x: 0, y: 0, w: 3, h: 2 } },
          { instanceId: 'w2', widgetId: 'built-in:timer', config: {}, layout: { x: 0, y: 2, w: 3, h: 2 } },
        ],
      })
      useDashboardStore.getState().updateLayout([{ i: 'w1', x: 1, y: 1, w: 2, h: 2 }])
      const w2 = useDashboardStore.getState().widgets.find((w) => w.instanceId === 'w2')!
      expect(w2.layout).toEqual({ x: 0, y: 2, w: 3, h: 2 })
    })

    it('handles an empty layout array without modifying widgets', () => {
      useDashboardStore.setState({
        widgets: [{ instanceId: 'w1', widgetId: 'built-in:clock', config: {}, layout: { x: 0, y: 0, w: 3, h: 2 } }],
      })
      useDashboardStore.getState().updateLayout([])
      expect(useDashboardStore.getState().widgets[0].layout).toEqual({ x: 0, y: 0, w: 3, h: 2 })
    })

    it('strips min/max constraint keys (only x,y,w,h are persisted)', () => {
      useDashboardStore.setState({
        widgets: [
          {
            instanceId: 'w1',
            widgetId: 'built-in:clock',
            config: {},
            layout: { x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2, maxW: 6, maxH: 4 },
          },
        ],
      })
      useDashboardStore.getState().updateLayout([{ i: 'w1', x: 1, y: 1, w: 2, h: 2 }])
      const { layout } = useDashboardStore.getState().widgets[0]
      expect(layout.x).toBe(1)
      expect(layout.minW).toBeUndefined()
      expect(layout.maxW).toBeUndefined()
    })
  })
})
