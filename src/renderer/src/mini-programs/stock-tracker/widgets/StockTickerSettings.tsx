import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { WidgetProps } from '@/types/widget'

export function StockTickerSettings({ config, onConfigChange }: WidgetProps): React.ReactElement {
  const symbols = (config.symbols as string[]) || ['MSFT']
  const [input, setInput] = useState('')

  const addSymbol = (): void => {
    const symbol = input.trim().toUpperCase()
    if (symbol && !symbols.includes(symbol)) {
      onConfigChange({ symbols: [...symbols, symbol] })
    }
    setInput('')
  }

  const removeSymbol = (symbol: string): void => {
    onConfigChange({ symbols: symbols.filter((s) => s !== symbol) })
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      <span className="text-xs text-white/50">Tracked symbols</span>

      <div className="flex gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSymbol()}
          placeholder="e.g. AAPL"
          className="flex-1 rounded bg-white/10 px-2 py-1 text-xs text-white placeholder-white/30 outline-none"
        />
        <button
          onClick={addSymbol}
          className="rounded bg-white/10 p-1 hover:bg-white/20"
          title="Add"
        >
          <Plus size={12} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {symbols.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-xs"
          >
            {s}
            <button onClick={() => removeSymbol(s)} className="text-white/40 hover:text-white">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
