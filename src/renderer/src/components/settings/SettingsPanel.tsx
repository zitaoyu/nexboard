import { X } from 'lucide-react'
import { useSettingsStore } from '@/stores/settings-store'

export function SettingsPanel(): React.ReactElement {
  const { widgetBackgroundOpacity, setWidgetBackgroundOpacity, dashboardBackgroundOpacity, setDashboardBackgroundOpacity, toggleSettings } =
    useSettingsStore()

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={toggleSettings}
    >
      <div
        className="w-full max-w-xs rounded-2xl border border-white/10 bg-gray-900/95 p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">Settings</h2>
          <button
            onClick={toggleSettings}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Dashboard Background Opacity */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dashboard Background Opacity</span>
              <span className="text-xs text-white/40">{Math.round(dashboardBackgroundOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={dashboardBackgroundOpacity}
              onChange={(e) => setDashboardBackgroundOpacity(parseFloat(e.target.value))}
              className="mt-1 w-full accent-blue-500"
            />
          </div>

          {/* Widget Background Opacity */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Widget Background Opacity</span>
              <span className="text-xs text-white/40">{Math.round(widgetBackgroundOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={widgetBackgroundOpacity}
              onChange={(e) => setWidgetBackgroundOpacity(parseFloat(e.target.value))}
              className="mt-1 w-full accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
