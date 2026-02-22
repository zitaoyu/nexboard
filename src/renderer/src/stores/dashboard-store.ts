import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { WidgetInstance } from '@/types/widget'
import type { LayoutItem } from '@/types/layout'
import { widgetRegistry } from '@/widgets/registry'

interface DashboardState {
  widgets: WidgetInstance[]

  addWidget: (widgetId: string) => void
  removeWidget: (instanceId: string) => void
  updateWidgetConfig: (instanceId: string, config: Record<string, unknown>) => void
  updateLayout: (layouts: LayoutItem[]) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: [],

      addWidget: (widgetId: string): void => {
        const definition = widgetRegistry.get(widgetId)
        if (!definition) return

        const { defaultSize, minSize, maxSize } = definition.manifest
        const instance: WidgetInstance = {
          instanceId: uuid(),
          widgetId,
          config: {},
          layout: {
            x: 0,
            y: Infinity, // Place at the bottom
            w: defaultSize.w,
            h: defaultSize.h,
            ...(minSize && { minW: minSize.w, minH: minSize.h }),
            ...(maxSize && { maxW: maxSize.w, maxH: maxSize.h })
          }
        }

        set((state) => ({ widgets: [...state.widgets, instance] }))
      },

      removeWidget: (instanceId: string): void => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.instanceId !== instanceId)
        }))
      },

      updateWidgetConfig: (instanceId: string, config: Record<string, unknown>): void => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.instanceId === instanceId ? { ...w, config: { ...w.config, ...config } } : w
          )
        }))
      },

      updateLayout: (layouts: LayoutItem[]): void => {
        set((state) => ({
          widgets: state.widgets.map((w) => {
            const layoutItem = layouts.find((l) => l.i === w.instanceId)
            if (!layoutItem) return w
            return {
              ...w,
              layout: {
                x: layoutItem.x,
                y: layoutItem.y,
                w: layoutItem.w,
                h: layoutItem.h
              }
            }
          })
        }))
      }
    }),
    { name: 'nexboard-dashboard' }
  )
)
