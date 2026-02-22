import type { WidgetDefinition } from '@/types/widget'
import { TimerWidget } from './TimerWidget'
import { TimerSettings } from './TimerSettings'

export const timerWidget: WidgetDefinition = {
  manifest: {
    id: 'built-in:timer',
    name: 'Timer',
    description: 'Countdown timer and stopwatch',
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 6, h: 4 },
    sourceProgram: null,
    icon: 'Timer'
  },
  Component: TimerWidget,
  SettingsComponent: TimerSettings
}
