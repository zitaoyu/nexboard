import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  /** Finnhub API key for stock data */
  finnhubApiKey: string
  /** Whether the settings panel is open */
  settingsOpen: boolean

  setFinnhubApiKey: (key: string) => void
  toggleSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      finnhubApiKey: '',
      settingsOpen: false,

      setFinnhubApiKey: (key: string): void => set({ finnhubApiKey: key }),
      toggleSettings: (): void => set((state) => ({ settingsOpen: !state.settingsOpen }))
    }),
    {
      name: 'nexboard-settings',
      partialize: (state) => ({
        finnhubApiKey: state.finnhubApiKey
      })
    }
  )
)
