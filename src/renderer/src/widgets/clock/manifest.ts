import type { WidgetDefinition } from '@/types/widget'
import { ClockWidget } from './ClockWidget'
import { ClockSettings } from './ClockSettings'

export const clockWidget: WidgetDefinition = {
  manifest: {
    id: 'built-in:clock',
    name: 'Clock',
    description: 'Displays the current time',
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 6, h: 4 },
    sourceProgram: null,
    icon: 'Clock'
  },
  Component: ClockWidget,
  SettingsComponent: ClockSettings
}
