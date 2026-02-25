import { useQuery } from '@tanstack/react-query'
import { getStockData, type StockData } from '../api/yahoo'

export function useStockData(symbol: string) {
  return useQuery<StockData>({
    queryKey: ['stock-data', symbol],
    queryFn: () => getStockData(symbol),
    enabled: !!symbol,
    staleTime: 30_000,
    // Poll every 60 s during REGULAR market hours; every 5 min otherwise
    refetchInterval: (query) => {
      const state = query.state.data?.marketState
      return state === 'REGULAR' ? 60_000 : 5 * 60_000
    }
  })
}
