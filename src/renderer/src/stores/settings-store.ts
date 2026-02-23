import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  /** Finnhub API key for stock data */
  finnhubApiKey: string
  /** Dashboard content opacity (0.2 – 1.0) */
  dashboardOpacity: number
  /** Whether the settings panel is open */
  settingsOpen: boolean

  setFinnhubApiKey: (key: string) => void
  setDashboardOpacity: (opacity: number) => void
  toggleSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      finnhubApiKey: '',
      dashboardOpacity: 1,
      settingsOpen: false,

      setFinnhubApiKey: (key) => { set({ finnhubApiKey: key }) },
      setDashboardOpacity: (opacity) => { set({ dashboardOpacity: opacity }) },
      toggleSettings: () => { set((state) => ({ settingsOpen: !state.settingsOpen })) }
    }),
    {
      name: 'nexboard-settings',
      partialize: (state) => ({
        finnhubApiKey: state.finnhubApiKey,
        dashboardOpacity: state.dashboardOpacity
      })
    }
  )
)
