import { useState, useCallback } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StockSearch } from './components/StockSearch'
import { StockChart } from './components/StockChart'
import { WatchList } from './components/WatchList'

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
      addSymbol: (symbol: string) =>
        set((state) => ({
          symbols: state.symbols.includes(symbol) ? state.symbols : [...state.symbols, symbol]
        })),
      removeSymbol: (symbol: string) =>
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

  const handleSearchSelect = useCallback(
    (symbol: string) => {
      addSymbol(symbol)
      setSelectedSymbol(symbol)
    },
    [addSymbol]
  )

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
