import type { MiniProgramDefinition } from '@/types/mini-program'
import { StockTrackerApp } from './StockTrackerApp'
import { stockTickerWidget } from './widgets/manifest'

export const stockTrackerProgram: MiniProgramDefinition = {
  manifest: {
    id: 'stock-tracker',
    name: 'Stock Tracker',
    description: 'Track stock prices with real-time data',
    icon: 'TrendingUp',
    color: '#22c55e'
  },
  AppComponent: StockTrackerApp,
  widgets: [stockTickerWidget]
}
