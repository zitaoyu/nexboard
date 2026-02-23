import { X } from 'lucide-react'
import { useSettingsStore } from '@/stores/settings-store'

export function SettingsPanel(): React.ReactElement {
  const { finnhubApiKey, setFinnhubApiKey, dashboardOpacity, setDashboardOpacity, toggleSettings } =
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
          {/* Dashboard Opacity */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dashboard Opacity</span>
              <span className="text-xs text-white/40">{Math.round(dashboardOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={1}
              step={0.05}
              value={dashboardOpacity}
              onChange={(e) => setDashboardOpacity(parseFloat(e.target.value))}
              className="mt-1 w-full accent-blue-500"
            />
          </div>

          {/* Finnhub API Key */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Finnhub API Key</span>
            <span className="text-xs text-white/40">
              Required for stock tracker. Get a free key at finnhub.io
            </span>
            <input
              type="password"
              value={finnhubApiKey}
              onChange={(e) => setFinnhubApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="mt-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
