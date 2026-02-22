const BASE_URL = 'https://finnhub.io/api/v1'

export interface StockQuote {
  /** Current price */
  c: number
  /** Change */
  d: number
  /** Percent change */
  dp: number
  /** High price of the day */
  h: number
  /** Low price of the day */
  l: number
  /** Open price of the day */
  o: number
  /** Previous close price */
  pc: number
  /** Timestamp */
  t: number
}

export interface StockCandle {
  /** Close prices */
  c: number[]
  /** High prices */
  h: number[]
  /** Low prices */
  l: number[]
  /** Open prices */
  o: number[]
  /** Timestamps */
  t: number[]
  /** Volume */
  v: number[]
  /** Status */
  s: string
}

export interface SymbolSearchResult {
  count: number
  result: Array<{
    description: string
    displaySymbol: string
    symbol: string
    type: string
  }>
}

function buildUrl(path: string, params: Record<string, string>): string {
  const url = new URL(`${BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function getQuote(symbol: string, apiKey: string): Promise<StockQuote> {
  const url = buildUrl('/quote', { symbol, token: apiKey })
  return fetchJson<StockQuote>(url)
}

export async function searchSymbol(query: string, apiKey: string): Promise<SymbolSearchResult> {
  const url = buildUrl('/search', { q: query, token: apiKey })
  return fetchJson<SymbolSearchResult>(url)
}

export async function getCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
  apiKey: string
): Promise<StockCandle> {
  const url = buildUrl('/stock/candle', {
    symbol,
    resolution,
    from: from.toString(),
    to: to.toString(),
    token: apiKey
  })
  return fetchJson<StockCandle>(url)
}
