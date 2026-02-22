import { useState, useCallback } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSettingsStore } from '@/stores/settings-store'
import { StockSearch } from './components/StockSearch'
import { StockChart } from './components/StockChart'
import { WatchList } from './components/WatchList'
import { Settings } from 'lucide-react'

/** Persisted watchlist store for the stock tracker */
interface WatchListState {
  symbols: string[]
  addSymbol: (symbol: string) => void
  removeSymbol: (symbol: string) => void
}

const useWatchListStore = create<WatchListState>()(
  persist(
    (set) => ({
      symbols: [],
      addSymbol: (symbol: string): void =>
        set((state) => ({
          symbols: state.symbols.includes(symbol) ? state.symbols : [...state.symbols, symbol]
        })),
      removeSymbol: (symbol: string): void =>
        set((state) => ({
          symbols: state.symbols.filter((s) => s !== symbol)
        }))
    }),
    { name: 'nexboard-watchlist' }
  )
)

export function StockTrackerApp(): React.ReactElement {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const { symbols, addSymbol, removeSymbol } = useWatchListStore()
  const apiKey = useSettingsStore((s) => s.finnhubApiKey)
  const toggleSettings = useSettingsStore((s) => s.toggleSettings)

  const handleSearchSelect = useCallback(
    (symbol: string) => {
      addSymbol(symbol)
      setSelectedSymbol(symbol)
    },
    [addSymbol]
  )

  if (!apiKey) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-medium">Stock Tracker</h2>
          <p className="max-w-sm text-sm text-white/50">
            To get started, you need a free Finnhub API key. Visit{' '}
            <span className="text-blue-400">finnhub.io</span> to create an account, then add your
            key in settings.
          </p>
        </div>
        <button
          onClick={toggleSettings}
          className="flex items-center gap-2 rounded-lg bg-blue-500/80 px-4 py-2 text-sm transition-colors hover:bg-blue-500"
        >
          <Settings size={14} />
          Open Settings
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto">
      <StockSearch onSelect={handleSearchSelect} />

      {/* Chart area */}
      {selectedSymbol && (
        <div className="flex shrink-0 flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-3">
          <h3 className="text-sm font-medium">{selectedSymbol}</h3>
          <span className="text-xs text-white/40">30-day price history</span>
          <StockChart symbol={selectedSymbol} />
        </div>
      )}

      {/* Watchlist */}
      <WatchList
        symbols={symbols}
        selectedSymbol={selectedSymbol}
        onSelect={setSelectedSymbol}
        onRemove={removeSymbol}
      />
    </div>
  )
}
