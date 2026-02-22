import { TrendingUp, TrendingDown } from 'lucide-react'
import { useStockQuote } from '../hooks/use-stock-quote'

interface StockQuoteProps {
  symbol: string
  onSelect?: () => void
  compact?: boolean
}

export function StockQuoteCard({
  symbol,
  onSelect,
  compact = false
}: StockQuoteProps): React.ReactElement {
  const { data, isLoading, error } = useStockQuote(symbol)

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl bg-white/5 p-3">
        <div className="mb-2 h-4 w-16 rounded bg-white/10" />
        <div className="h-6 w-24 rounded bg-white/10" />
      </div>
    )
  }

  if (error || !data || data.c === 0) {
    return (
      <div className="rounded-xl bg-white/5 p-3">
        <span className="text-sm font-medium">{symbol}</span>
        <div className="text-xs text-white/40">Data unavailable</div>
      </div>
    )
  }

  const isPositive = data.d >= 0

  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-xl bg-white/5 text-left transition-colors hover:bg-white/10 ${compact ? 'p-2' : 'p-3'}`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{symbol}</span>
        {isPositive ? (
          <TrendingUp size={compact ? 12 : 14} className="text-green-400" />
        ) : (
          <TrendingDown size={compact ? 12 : 14} className="text-red-400" />
        )}
      </div>
      <div className={`mt-1 font-semibold ${compact ? 'text-sm' : 'text-xl'}`}>
        ${data.c.toFixed(2)}
      </div>
      <div
        className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}
      >
        {isPositive ? '+' : ''}
        {data.d.toFixed(2)} ({isPositive ? '+' : ''}
        {data.dp.toFixed(2)}%)
      </div>
    </button>
  )
}
