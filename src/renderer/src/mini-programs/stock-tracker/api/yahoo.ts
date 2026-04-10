import type { StockQuote, SymbolSearchResult } from './finnhub'

export interface IntradayData {
  timestamps: number[]
  closes: number[]
}

export interface StockData {
  quote: StockQuote
  intraday: IntradayData
  /** Yahoo market state: 'REGULAR' | 'PRE' | 'POST' | 'CLOSED' */
  marketState: string
}

export async function getStockData(symbol: string): Promise<StockData> {
  // range=5d ensures we always have a previous complete trading day when market is closed
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=5d`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = (await window.api.httpGet(url)) as any
  const result = json?.chart?.result?.[0]
  if (!result) throw new Error(`No data for ${symbol}`)

  const meta = result.meta
  const timestamps = result.timestamp as number[] | undefined
  const rawQuote = result.indicators?.quote?.[0]

  // Collect all valid (non-null) candles across the 5-day window
  const allPoints: { t: number; c: number }[] = []
  if (timestamps && rawQuote?.close) {
    for (let i = 0; i < timestamps.length; i++) {
      if (rawQuote.close[i] != null) {
        allPoints.push({ t: timestamps[i], c: rawQuote.close[i] })
      }
    }
  }

  // Keep only the most recent trading session (all candles within 24 h of the last one)
  const lastTs = allPoints.length > 0 ? allPoints[allPoints.length - 1].t : 0
  const sessionCutoff = lastTs - 24 * 3600
  const sessionPoints = allPoints.filter((p) => p.t > sessionCutoff)

  // Compute price and change from first principles.
  // meta.regularMarketChange / regularMarketChangePercent are absent in Yahoo v8 responses.
  // Use previousClose (yesterday's close) — NOT chartPreviousClose which is the close at the
  // start of the chart range (5 days ago) and would give the wrong daily change.
  const c = (meta.regularMarketPrice as number) || (sessionPoints.at(-1)?.c ?? 0)
  const pc = (meta.previousClose as number) || (meta.chartPreviousClose as number) || 0
  const d = pc > 0 ? c - pc : 0
  const dp = pc > 0 ? (d / pc) * 100 : 0

  // meta.marketState is absent in Yahoo v8 responses; derive it from currentTradingPeriod
  const nowSec = Date.now() / 1000
  const regular = meta.currentTradingPeriod?.regular as { start: number; end: number } | undefined
  const pre = meta.currentTradingPeriod?.pre as { start: number; end: number } | undefined
  const post = meta.currentTradingPeriod?.post as { start: number; end: number } | undefined
  let marketState = 'CLOSED'
  if (regular && nowSec >= regular.start && nowSec < regular.end) marketState = 'REGULAR'
  else if (pre && nowSec >= pre.start && nowSec < pre.end) marketState = 'PRE'
  else if (post && nowSec >= post.start && nowSec < post.end) marketState = 'POST'

  const quote: StockQuote = {
    c,
    d,
    dp,
    h: (meta.regularMarketDayHigh as number) ?? 0,
    l: (meta.regularMarketDayLow as number) ?? 0,
    o: (meta.regularMarketOpen as number) ?? 0,
    pc,
    t: (meta.regularMarketTime as number) ?? 0
  }

  return {
    quote,
    marketState,
    intraday: {
      timestamps: sessionPoints.map((p) => p.t),
      closes: sessionPoints.map((p) => p.c)
    }
  }
}

export async function searchSymbol(query: string): Promise<SymbolSearchResult> {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0&enableFuzzyQuery=true`
  const json = (await window.api.httpGet(url, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  })) as any // eslint-disable-line @typescript-eslint/no-explicit-any
  const quotes: any[] = json?.quotes ?? [] // eslint-disable-line @typescript-eslint/no-explicit-any

  return {
    count: quotes.length,
    result: quotes
      .filter((q) => {
        const t = ((q.typeDisp ?? q.quoteType ?? '') as string).toLowerCase()
        return t === 'equity' || t === 'etf'
      })
      .map((q) => ({
        description: q.longname ?? q.shortname ?? q.symbol,
        displaySymbol: q.symbol,
        symbol: q.symbol,
        type: q.typeDisp ?? q.quoteType ?? 'Equity'
      }))
  }
}
