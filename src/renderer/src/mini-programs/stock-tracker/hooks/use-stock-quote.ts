import { useQuery } from '@tanstack/react-query'
import { getQuote, type StockQuote } from '../api/finnhub'
import { useSettingsStore } from '@/stores/settings-store'

export function useStockQuote(symbol: string) {
  const apiKey = useSettingsStore((s) => s.finnhubApiKey)

  return useQuery<StockQuote>({
    queryKey: ['stock-quote', symbol],
    queryFn: () => getQuote(symbol, apiKey),
    enabled: !!symbol && !!apiKey,
    staleTime: 30_000,
    refetchInterval: 60_000
  })
}
