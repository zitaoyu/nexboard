import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  /** Widget background opacity (0 – 1.0) */
  widgetBackgroundOpacity: number
  /** Dashboard (AppShell) background opacity (0 – 1.0) */
  dashboardBackgroundOpacity: number
  /** Whether the settings panel is open */
  settingsOpen: boolean

  setWidgetBackgroundOpacity: (opacity: number) => void
  setDashboardBackgroundOpacity: (opacity: number) => void
  toggleSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      widgetBackgroundOpacity: 0.2,
      dashboardBackgroundOpacity: 0,
      settingsOpen: false,

      setWidgetBackgroundOpacity: (opacity) => { set({ widgetBackgroundOpacity: opacity }) },
      setDashboardBackgroundOpacity: (opacity) => { set({ dashboardBackgroundOpacity: opacity }) },
      toggleSettings: () => { set((state) => ({ settingsOpen: !state.settingsOpen })) }
    }),
    {
      name: 'nexboard-settings',
      partialize: (state) => ({
        widgetBackgroundOpacity: state.widgetBackgroundOpacity,
        dashboardBackgroundOpacity: state.dashboardBackgroundOpacity
      })
    }
  )
)
