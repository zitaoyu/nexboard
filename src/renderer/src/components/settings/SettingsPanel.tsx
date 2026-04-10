import { useState } from 'react'
import { X } from 'lucide-react'
import { useSettingsStore } from '@/stores/settings-store'
import { useDashboardStore } from '@/stores/dashboard-store'

export function SettingsPanel(): React.ReactElement {
  const { widgetBackgroundOpacity, setWidgetBackgroundOpacity, dashboardBackgroundOpacity, setDashboardBackgroundOpacity, uiScale, setUiScale, toggleSettings, resetSettings } =
    useSettingsStore()
  const resetDashboard = useDashboardStore((s) => s.resetDashboard)
  const [confirming, setConfirming] = useState(false)

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

          {/* UI Scale */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">UI Scale</span>
              <span className="text-xs text-white/40">{Math.round(uiScale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.75}
              max={1.5}
              step={0.05}
              value={uiScale}
              onChange={(e) => setUiScale(parseFloat(e.target.value))}
              className="mt-1 w-full accent-blue-500"
            />
          </div>
          {confirming ? (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => { resetDashboard(); resetSettings(); window.api.resetWindowBounds(); setConfirming(false) }}
                className="flex-1 rounded-lg bg-red-500/20 py-1.5 text-sm text-red-400 hover:bg-red-500/30 hover:text-red-300"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-lg border border-white/10 py-1.5 text-sm text-white/50 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="mt-2 w-full rounded-lg border border-white/10 py-1.5 text-sm text-white/50 hover:bg-white/10 hover:text-white"
            >
              Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
