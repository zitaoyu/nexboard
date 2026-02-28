import type { WidgetDefinition } from '@/types/widget'
import { PhotoWidget } from './PhotoWidget'
import { PhotoSettings } from './PhotoSettings'

export const photoWidget: WidgetDefinition = {
  manifest: {
    id: 'built-in:photo',
    name: 'Photo',
    description: 'Display photos with optional slideshow rotation',
    defaultSize: { w: 3, h: 3 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 8, h: 8 },
    sourceProgram: null,
    icon: 'Image',
    fullBleed: true,
    noBorder: true,
  },
  Component: PhotoWidget,
  SettingsComponent: PhotoSettings,
}
