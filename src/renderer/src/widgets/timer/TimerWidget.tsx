import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import type { WidgetProps } from '@/types/widget'

type TimerMode = 'countdown' | 'stopwatch'

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  const pad = (n: number): string => n.toString().padStart(2, '0')

  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

export function TimerWidget({ config }: WidgetProps): React.ReactElement {
  const mode = (config.mode as TimerMode) || 'stopwatch'
  const defaultDuration = (config.defaultDuration as number) || 300 // 5 minutes

  const [seconds, setSeconds] = useState(mode === 'countdown' ? defaultDuration : 0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  const start = useCallback(() => {
    if (intervalRef.current) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === 'countdown') {
          if (prev <= 1) {
            stop()
            return 0
          }
          return prev - 1
        }
        return prev + 1
      })
    }, 1000)
  }, [mode, stop])

  const reset = useCallback(() => {
    stop()
    setSeconds(mode === 'countdown' ? defaultDuration : 0)
  }, [mode, defaultDuration, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Reset when mode or default duration changes
  useEffect(() => {
    reset()
  }, [mode, defaultDuration, reset])

  // Progress for countdown mode (0 to 1)
  const progress = mode === 'countdown' ? 1 - seconds / defaultDuration : 0

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <div className="text-xs uppercase tracking-widest text-white/40">
        {mode === 'countdown' ? 'Countdown' : 'Stopwatch'}
      </div>

      <div className="relative">
        {mode === 'countdown' && (
          <svg className="absolute -inset-2" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(96,165,250,0.7)"
              strokeWidth="3"
              strokeDasharray={`${progress * 283} 283`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000"
            />
          </svg>
        )}
        <div className="text-3xl font-light tabular-nums tracking-wide">{formatTime(seconds)}</div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={running ? stop : start}
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          title={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  )
}
