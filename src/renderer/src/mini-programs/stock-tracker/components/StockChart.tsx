import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useStockCandles } from '../hooks/use-stock-candles'

interface StockChartProps {
  symbol: string
}

export function StockChart({ symbol }: StockChartProps): React.ReactElement {
  const { data, isLoading, error } = useStockCandles(symbol)

  const chartData = useMemo(() => {
    if (!data || data.s === 'no_data' || !data.c) return []
    return data.t.map((timestamp, i) => ({
      date: new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      price: data.c[i]
    }))
  }, [data])

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="text-sm text-white/40">Loading chart...</span>
      </div>
    )
  }

  if (error || chartData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="text-sm text-white/40">No chart data available</span>
      </div>
    )
  }

  const isPositive = chartData[chartData.length - 1].price >= chartData[0].price
  const color = isPositive ? '#4ade80' : '#f87171'

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={55}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(17,24,39,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${symbol})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
