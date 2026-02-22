import type { WidgetProps } from '@/types/widget'

const COMMON_TIMEZONES = [
  { label: 'Local', value: '' },
  { label: 'UTC', value: 'UTC' },
  { label: 'US Eastern', value: 'America/New_York' },
  { label: 'US Central', value: 'America/Chicago' },
  { label: 'US Pacific', value: 'America/Los_Angeles' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Shanghai', value: 'Asia/Shanghai' },
  { label: 'Sydney', value: 'Australia/Sydney' }
]

export function ClockSettings({ config, onConfigChange }: WidgetProps): React.ReactElement {
  const use24h = (config.use24h as boolean) ?? false
  const showSeconds = (config.showSeconds as boolean) ?? true
  const timezone = (config.timezone as string) || ''

  return (
    <div className="flex flex-col gap-3 p-3">
      <label className="flex items-center justify-between">
        <span className="text-sm">24-hour format</span>
        <input
          type="checkbox"
          checked={use24h}
          onChange={(e) => onConfigChange({ use24h: e.target.checked })}
          className="h-4 w-4 rounded accent-blue-500"
        />
      </label>

      <label className="flex items-center justify-between">
        <span className="text-sm">Show seconds</span>
        <input
          type="checkbox"
          checked={showSeconds}
          onChange={(e) => onConfigChange({ showSeconds: e.target.checked })}
          className="h-4 w-4 rounded accent-blue-500"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Timezone</span>
        <select
          value={timezone}
          onChange={(e) => onConfigChange({ timezone: e.target.value })}
          className="rounded bg-white/10 px-2 py-1 text-sm text-white outline-none"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value} className="bg-gray-800">
              {tz.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
