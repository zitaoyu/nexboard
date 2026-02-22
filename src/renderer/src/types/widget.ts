import type { ComponentType } from 'react'

/** Metadata describing a widget type */
export interface WidgetManifest {
  /** Unique identifier, e.g. "built-in:clock" or "stock-tracker:ticker" */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Default grid size { w: columns, h: rows } */
  defaultSize: { w: number; h: number }
  /** Minimum grid size */
  minSize?: { w: number; h: number }
  /** Maximum grid size */
  maxSize?: { w: number; h: number }
  /** Which mini program provides this widget (null for built-in) */
  sourceProgram: string | null
  /** Icon name from lucide-react */
  icon?: string
}

/** Runtime state for a placed widget instance on the dashboard */
export interface WidgetInstance {
  /** Unique instance ID (UUID) */
  instanceId: string
  /** References WidgetManifest.id */
  widgetId: string
  /** User-configured settings for this instance */
  config: Record<string, unknown>
  /** react-grid-layout position */
  layout: { x: number; y: number; w: number; h: number }
}

/** Props passed to every widget component */
export interface WidgetProps {
  instanceId: string
  config: Record<string, unknown>
  onConfigChange: (config: Record<string, unknown>) => void
}

/** Full widget definition — what a widget module exports */
export interface WidgetDefinition {
  manifest: WidgetManifest
  Component: ComponentType<WidgetProps>
  SettingsComponent?: ComponentType<WidgetProps>
}
