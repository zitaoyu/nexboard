import { TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts'
import { useStockData } from '../hooks/use-stock-data'

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
  const { data, isLoading, error } = useStockData(symbol)

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl bg-white/5 p-3">
        <div className="mb-2 h-4 w-16 rounded bg-white/10" />
        <div className="h-6 w-24 rounded bg-white/10" />
      </div>
    )
  }

  if (error || !data || data.quote.c === 0) {
    return (
      <div className="rounded-xl bg-white/5 p-3">
        <span className="text-sm font-medium">{symbol}</span>
        <div className="text-xs text-white/40">Data unavailable</div>
      </div>
    )
  }

  const { quote, intraday } = data
  const isPositive = quote.d >= 0
  const accentColor = isPositive ? '#4ade80' : '#f87171'
  const chartData = intraday.closes.map((v) => ({ v }))

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
        ${quote.c.toFixed(2)}
      </div>
      <div className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}
        {quote.d.toFixed(2)} ({isPositive ? '+' : ''}
        {quote.dp.toFixed(2)}%)
      </div>

      {compact && chartData.length > 1 && (
        <div className="mt-1.5 h-7">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 1, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Area
                type="monotone"
                dataKey="v"
                stroke={accentColor}
                strokeWidth={1.5}
                fill={`url(#grad-${symbol})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </button>
  )
}
