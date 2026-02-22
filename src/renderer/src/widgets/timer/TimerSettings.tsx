import type { WidgetProps } from '@/types/widget'

type TimerMode = 'countdown' | 'stopwatch'

export function TimerSettings({ config, onConfigChange }: WidgetProps): React.ReactElement {
  const mode = (config.mode as TimerMode) || 'stopwatch'
  const defaultDuration = (config.defaultDuration as number) || 300

  const minutes = Math.floor(defaultDuration / 60)
  const seconds = defaultDuration % 60

  return (
    <div className="flex flex-col gap-3 p-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm">Mode</span>
        <select
          value={mode}
          onChange={(e) => onConfigChange({ mode: e.target.value })}
          className="rounded bg-white/10 px-2 py-1 text-sm text-white outline-none"
        >
          <option value="stopwatch" className="bg-gray-800">
            Stopwatch
          </option>
          <option value="countdown" className="bg-gray-800">
            Countdown
          </option>
        </select>
      </label>

      {mode === 'countdown' && (
        <div className="flex gap-2">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm">Minutes</span>
            <input
              type="number"
              min={0}
              max={99}
              value={minutes}
              onChange={(e) => {
                const m = Math.max(0, parseInt(e.target.value) || 0)
                onConfigChange({ defaultDuration: m * 60 + seconds })
              }}
              className="w-full rounded bg-white/10 px-2 py-1 text-sm text-white outline-none"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm">Seconds</span>
            <input
              type="number"
              min={0}
              max={59}
              value={seconds}
              onChange={(e) => {
                const s = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                onConfigChange({ defaultDuration: minutes * 60 + s })
              }}
              className="w-full rounded bg-white/10 px-2 py-1 text-sm text-white outline-none"
            />
          </label>
        </div>
      )}
    </div>
  )
}
