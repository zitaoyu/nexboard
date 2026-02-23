import { useQuery } from '@tanstack/react-query'
import type { StockCandle } from '../api/finnhub'

async function fetchYahooCandles(symbol: string, range: string): Promise<StockCandle> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = await window.api.httpGet(url) as any
  const result = json?.chart?.result?.[0]
  if (!result) return { s: 'no_data', c: [], h: [], l: [], o: [], t: [], v: [] }
  const { timestamp, indicators } = result
  const quote = indicators?.quote?.[0]
  if (!timestamp || !quote) return { s: 'no_data', c: [], h: [], l: [], o: [], t: [], v: [] }

  // Yahoo Finance includes null for non-trading days — filter them out
  const indices = (timestamp as number[])
    .map((t, i) => ({ t, i }))
    .filter(({ i }) => quote.close[i] != null)

  return {
    s: 'ok',
    t: indices.map(({ t }) => t),
    c: indices.map(({ i }) => quote.close[i]),
    h: indices.map(({ i }) => quote.high[i]),
    l: indices.map(({ i }) => quote.low[i]),
    o: indices.map(({ i }) => quote.open[i]),
    v: indices.map(({ i }) => quote.volume[i])
  }
}

export function useStockCandles(symbol: string, _resolution = 'D', days = 30) {
  const range = days <= 30 ? '1mo' : days <= 90 ? '3mo' : '1y'

  return useQuery<StockCandle>({
    queryKey: ['stock-candles', symbol, range],
    queryFn: () => fetchYahooCandles(symbol, range),
    enabled: !!symbol,
    staleTime: 5 * 60_000
  })
}
