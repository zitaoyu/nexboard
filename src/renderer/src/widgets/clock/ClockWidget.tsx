import { useState, useEffect } from 'react'
import type { WidgetProps } from '@/types/widget'

export function ClockWidget({ config }: WidgetProps): React.ReactElement {
  const [now, setNow] = useState(new Date())
  const use24h = (config.use24h as boolean) ?? false
  const showSeconds = (config.showSeconds as boolean) ?? true
  const timezone = (config.timezone as string) || undefined

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds && { second: '2-digit' }),
    hour12: !use24h,
    ...(timezone && { timeZone: timezone })
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(timezone && { timeZone: timezone })
  }

  const timeStr = now.toLocaleTimeString(undefined, timeOptions)
  const dateStr = now.toLocaleDateString(undefined, dateOptions)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-4">
      <div className="text-4xl font-light tracking-wide">{timeStr}</div>
      <div className="text-sm text-white/60">{dateStr}</div>
    </div>
  )
}
