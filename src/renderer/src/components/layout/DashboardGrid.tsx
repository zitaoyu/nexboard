import { useMemo, useCallback } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Grid3X3 } from 'lucide-react'
import { useDashboardStore } from '@/stores/dashboard-store'
import { useMiniProgramStore } from '@/stores/mini-program-store'
import { widgetRegistry } from '@/widgets/registry'
import { WidgetContainer } from './WidgetContainer'
import { AddWidgetButton } from './AddWidgetButton'
import type { LayoutItem } from '@/types/layout'
import 'react-grid-layout/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

export function DashboardGrid(): React.ReactElement {
  const widgets = useDashboardStore((s) => s.widgets)
  const updateLayout = useDashboardStore((s) => s.updateLayout)
  const openLauncher = useMiniProgramStore((s) => s.openLauncher)

  const layouts = useMemo(() => {
    return widgets.map((w) => ({
      i: w.instanceId,
      x: w.layout.x,
      y: w.layout.y,
      w: w.layout.w,
      h: w.layout.h,
      minW: widgetRegistry.get(w.widgetId)?.manifest.minSize?.w,
      minH: widgetRegistry.get(w.widgetId)?.manifest.minSize?.h,
      maxW: widgetRegistry.get(w.widgetId)?.manifest.maxSize?.w,
      maxH: widgetRegistry.get(w.widgetId)?.manifest.maxSize?.h
    }))
  }, [widgets])

  const onLayoutChange = useCallback(
    (layout: LayoutItem[]) => {
      updateLayout(layout)
    },
    [updateLayout]
  )

  return (
    <div className="relative h-full w-full overflow-auto p-3">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts }}
        breakpoints={{ lg: 400, md: 300, sm: 0 }}
        cols={{ lg: 4, md: 3, sm: 2 }}
        rowHeight={70}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-drag-handle"
        containerPadding={[0, 0]}
        margin={[8, 8]}
      >
        {widgets.map((widget) => (
          <div key={widget.instanceId}>
            <WidgetContainer instanceId={widget.instanceId} />
          </div>
        ))}
      </ResponsiveGridLayout>

      <button
        onClick={openLauncher}
        className="absolute bottom-4 right-16 z-40 rounded-full bg-white/10 p-3 shadow-lg transition-all opacity-0 hover:bg-white/20 group-hover:opacity-100"
        title="Mini Programs"
      >
        <Grid3X3 size={20} />
      </button>
      <AddWidgetButton />
    </div>
  )
}
