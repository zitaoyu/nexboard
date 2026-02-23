import { useState, useEffect, Component, type ReactNode } from 'react'
import { Settings, X, GripHorizontal } from 'lucide-react'
import { useDashboardStore } from '@/stores/dashboard-store'
import { widgetRegistry } from '@/widgets/registry'

interface WidgetContainerProps {
  instanceId: string
}

/** Error boundary that catches crashes inside individual widgets */
class WidgetErrorBoundary extends Component<
  { children: ReactNode; widgetName: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; widgetName: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-white/50">
          <span>{this.props.widgetName} crashed</span>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function WidgetContainer({ instanceId }: WidgetContainerProps): React.ReactElement {
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const widget = useDashboardStore((s) => s.widgets.find((w) => w.instanceId === instanceId))
  const removeWidget = useDashboardStore((s) => s.removeWidget)
  const updateWidgetConfig = useDashboardStore((s) => s.updateWidgetConfig)

  if (!widget) {
    return <div className="h-full rounded-xl bg-white/5 p-2 text-sm text-white/30">Not found</div>
  }

  const definition = widgetRegistry.get(widget.widgetId)
  if (!definition) {
    return (
      <div className="h-full rounded-xl bg-white/5 p-2 text-sm text-white/30">
        Unknown widget: {widget.widgetId}
      </div>
    )
  }

  const { Component: WidgetComponent, SettingsComponent, manifest } = definition

  const handleConfigChange = (config: Record<string, unknown>): void => {
    updateWidgetConfig(instanceId, config)
  }

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
    >
      {/* Title bar — visible on hover */}
      <div className="flex shrink-0 items-center gap-1 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Drag handle — only this area initiates dragging */}
        <div className="widget-drag-handle flex min-w-0 flex-1 cursor-grab items-center gap-1">
          <GripHorizontal size={12} className="shrink-0 text-white/40" />
          <span className="truncate text-xs text-white/50">{manifest.name}</span>
        </div>

        {SettingsComponent && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white/70"
            title="Settings"
          >
            <Settings size={13} />
          </button>
        )}

        <button
          onClick={() => removeWidget(instanceId)}
          className="rounded p-1 text-white/40 hover:bg-red-500/20 hover:text-red-400"
          title="Remove"
        >
          <X size={13} />
        </button>
      </div>

      {/* Widget content or settings */}
      <div className="min-h-0 flex-1">
        {showSettings && SettingsComponent ? (
          <SettingsComponent
            instanceId={instanceId}
            config={widget.config}
            onConfigChange={handleConfigChange}
          />
        ) : (
          <WidgetErrorBoundary widgetName={manifest.name}>
            <WidgetComponent
              instanceId={instanceId}
              config={widget.config}
              onConfigChange={handleConfigChange}
            />
          </WidgetErrorBoundary>
        )}
      </div>
    </div>
  )
}
