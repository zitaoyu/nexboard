import type { ComponentType } from 'react'
import type { WidgetDefinition } from './widget'

/** Metadata describing a mini program */
export interface MiniProgramManifest {
  /** Unique identifier, e.g. "stock-tracker" */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Icon name from lucide-react */
  icon: string
  /** Accent color for theming (CSS color value) */
  color: string
}

/** Full mini program definition — what a mini program module exports */
export interface MiniProgramDefinition {
  manifest: MiniProgramManifest
  /** The main app component rendered when the mini program is opened */
  AppComponent: ComponentType
  /** Widget definitions provided by this mini program */
  widgets: WidgetDefinition[]
}
