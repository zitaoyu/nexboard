import { useQuery } from '@tanstack/react-query'
import { getCandles, type StockCandle } from '../api/finnhub'
import { useSettingsStore } from '@/stores/settings-store'

export function useStockCandles(symbol: string, resolution = 'D', days = 30) {
  const apiKey = useSettingsStore((s) => s.finnhubApiKey)

  const to = Math.floor(Date.now() / 1000)
  const from = to - days * 24 * 60 * 60

  return useQuery<StockCandle>({
    queryKey: ['stock-candles', symbol, resolution, days],
    queryFn: () => getCandles(symbol, resolution, from, to, apiKey),
    enabled: !!symbol && !!apiKey,
    staleTime: 5 * 60_000 // 5 minutes for historical data
  })
}
