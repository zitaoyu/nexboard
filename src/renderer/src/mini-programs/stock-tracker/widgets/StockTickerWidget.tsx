import type { WidgetProps } from '@/types/widget'
import { StockQuoteCard } from '../components/StockQuote'

export function StockTickerWidget({ config }: WidgetProps): React.ReactElement {
  const symbols = (config.symbols as string[]) || ['AAPL']

  return (
    <div className="flex h-full flex-col gap-1.5 overflow-auto p-2">
      {symbols.map((symbol) => (
        <StockQuoteCard key={symbol} symbol={symbol} compact />
      ))}
    </div>
  )
}
