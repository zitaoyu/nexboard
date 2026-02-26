import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  /** Widget background opacity (0 – 1.0) */
  widgetBackgroundOpacity: number
  /** Dashboard (AppShell) background opacity (0 – 1.0) */
  dashboardBackgroundOpacity: number
  /** UI scale factor (0.75 – 1.5); applied as html font-size to scale all rem units */
  uiScale: number
  /** Whether the settings panel is open */
  settingsOpen: boolean

  setWidgetBackgroundOpacity: (opacity: number) => void
  setDashboardBackgroundOpacity: (opacity: number) => void
  setUiScale: (scale: number) => void
  toggleSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      widgetBackgroundOpacity: 0.6,
      dashboardBackgroundOpacity: 0.2,
      uiScale: 1.0,
      settingsOpen: false,

      setWidgetBackgroundOpacity: (opacity) => { set({ widgetBackgroundOpacity: opacity }) },
      setDashboardBackgroundOpacity: (opacity) => { set({ dashboardBackgroundOpacity: opacity }) },
      setUiScale: (scale) => { set({ uiScale: scale }) },
      toggleSettings: () => { set((state) => ({ settingsOpen: !state.settingsOpen })) }
    }),
    {
      name: 'nexboard-settings',
      partialize: (state) => ({
        widgetBackgroundOpacity: state.widgetBackgroundOpacity,
        dashboardBackgroundOpacity: state.dashboardBackgroundOpacity,
        uiScale: state.uiScale
      })
    }
  )
)
