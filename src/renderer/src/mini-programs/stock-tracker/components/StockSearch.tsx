import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { searchSymbol } from '../api/yahoo'

interface StockSearchProps {
  onSelect: (symbol: string) => void
}

export function StockSearch({ onSelect }: StockSearchProps): React.ReactElement {
  const [query, setQuery] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['stock-search', query],
    queryFn: () => searchSymbol(query),
    enabled: query.length >= 1,
    staleTime: 60_000
  })

  const handleSelect = useCallback(
    (symbol: string) => {
      onSelect(symbol)
      setQuery('')
    },
    [onSelect]
  )

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
        <Search size={14} className="text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks (e.g. AAPL)"
          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
        />
      </div>

      {query.length >= 1 && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-white/10 bg-gray-900/95 shadow-xl backdrop-blur-md">
          {isLoading ? (
            <div className="p-3 text-center text-xs text-white/40">Searching...</div>
          ) : isError ? (
            <div className="p-3 text-center text-xs text-red-400/70">Search unavailable</div>
          ) : data?.result?.length ? (
            data.result.slice(0, 8).map((item) => (
              <button
                key={item.symbol}
                onClick={() => handleSelect(item.symbol)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-white/10"
              >
                <span className="text-sm font-medium">{item.displaySymbol}</span>
                <span className="truncate text-xs text-white/50">{item.description}</span>
              </button>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-white/40">No results</div>
          )}
        </div>
      )}
    </div>
  )
}
