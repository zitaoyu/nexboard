import { X } from 'lucide-react'
import { StockQuoteCard } from './StockQuote'

interface WatchListProps {
  symbols: string[]
  selectedSymbol: string | null
  onSelect: (symbol: string) => void
  onRemove: (symbol: string) => void
}

export function WatchList({
  symbols,
  selectedSymbol,
  onSelect,
  onRemove
}: WatchListProps): React.ReactElement {
  if (symbols.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-white/40">
        No stocks tracked. Use the search above to add some.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {symbols.map((symbol) => (
        <div
          key={symbol}
          className={`relative rounded-xl transition-all ${
            selectedSymbol === symbol ? 'ring-1 ring-blue-500/50' : ''
          }`}
        >
          <StockQuoteCard symbol={symbol} onSelect={() => onSelect(symbol)} />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(symbol)
            }}
            className="absolute top-2 right-2 rounded-full p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/70"
            title="Remove from watchlist"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
