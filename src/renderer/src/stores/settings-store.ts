import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  /** Finnhub API key for stock data */
  finnhubApiKey: string
  /** Widget background opacity (0 – 1.0) */
  widgetBackgroundOpacity: number
  /** Dashboard (AppShell) background opacity (0 – 1.0) */
  dashboardBackgroundOpacity: number
  /** Whether the settings panel is open */
  settingsOpen: boolean

  setFinnhubApiKey: (key: string) => void
  setWidgetBackgroundOpacity: (opacity: number) => void
  setDashboardBackgroundOpacity: (opacity: number) => void
  toggleSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      finnhubApiKey: '',
      widgetBackgroundOpacity: 0.2,
      dashboardBackgroundOpacity: 0,
      settingsOpen: false,

      setFinnhubApiKey: (key) => { set({ finnhubApiKey: key }) },
      setWidgetBackgroundOpacity: (opacity) => { set({ widgetBackgroundOpacity: opacity }) },
      setDashboardBackgroundOpacity: (opacity) => { set({ dashboardBackgroundOpacity: opacity }) },
      toggleSettings: () => { set((state) => ({ settingsOpen: !state.settingsOpen })) }
    }),
    {
      name: 'nexboard-settings',
      partialize: (state) => ({
        finnhubApiKey: state.finnhubApiKey,
        widgetBackgroundOpacity: state.widgetBackgroundOpacity,
        dashboardBackgroundOpacity: state.dashboardBackgroundOpacity
      })
    }
  )
)
