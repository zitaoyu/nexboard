import type { WidgetDefinition } from '@/types/widget'
import { StockTickerWidget } from './StockTickerWidget'
import { StockTickerSettings } from './StockTickerSettings'

export const stockTickerWidget: WidgetDefinition = {
  manifest: {
    id: 'stock-tracker:ticker',
    name: 'Stock Ticker',
    description: 'Display real-time stock prices on your dashboard',
    defaultSize: { w: 2, h: 3 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 4, h: 12 },
    sourceProgram: 'stock-tracker',
    icon: 'TrendingUp'
  },
  Component: StockTickerWidget,
  SettingsComponent: StockTickerSettings
}
