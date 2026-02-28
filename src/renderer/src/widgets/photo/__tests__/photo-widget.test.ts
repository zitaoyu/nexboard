import { describe, it, expect } from 'vitest'
import { photoWidget } from '../manifest'
import { widgetRegistry } from '../../registry'

describe('photoWidget manifest', () => {
  it('has the correct id', () => {
    expect(photoWidget.manifest.id).toBe('built-in:photo')
  })

  it('has the expected name', () => {
    expect(photoWidget.manifest.name).toBe('Photo')
  })

  it('has a default size of 3×3', () => {
    expect(photoWidget.manifest.defaultSize).toEqual({ w: 3, h: 3 })
  })

  it('has minSize of 2×2', () => {
    expect(photoWidget.manifest.minSize).toEqual({ w: 2, h: 2 })
  })

  it('has maxSize of 8×8', () => {
    expect(photoWidget.manifest.maxSize).toEqual({ w: 8, h: 8 })
  })

  it('is a built-in widget (sourceProgram is null)', () => {
    expect(photoWidget.manifest.sourceProgram).toBeNull()
  })

  it('has a Component function', () => {
    expect(typeof photoWidget.Component).toBe('function')
  })

  it('has a SettingsComponent function', () => {
    expect(typeof photoWidget.SettingsComponent).toBe('function')
  })
})

describe('widgetRegistry includes photo widget', () => {
  it('contains built-in:photo', () => {
    expect(widgetRegistry.get('built-in:photo')).toBeDefined()
  })

  it('photo widget appears in getAll()', () => {
    const ids = widgetRegistry.getAll().map((d) => d.manifest.id)
    expect(ids).toContain('built-in:photo')
  })
})
