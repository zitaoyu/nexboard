import type { WidgetDefinition } from '@/types/widget'
import { clockWidget } from './clock/manifest'
import { timerWidget } from './timer/manifest'

class WidgetRegistry {
  private widgets = new Map<string, WidgetDefinition>()

  register(definition: WidgetDefinition): void {
    this.widgets.set(definition.manifest.id, definition)
  }

  get(widgetId: string): WidgetDefinition | undefined {
    return this.widgets.get(widgetId)
  }

  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values())
  }
}

export const widgetRegistry = new WidgetRegistry()

// Register built-in widgets
widgetRegistry.register(clockWidget)
widgetRegistry.register(timerWidget)
