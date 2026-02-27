import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../settings-store'

describe('settings-store', () => {
  beforeEach(() => {
    useSettingsStore.setState(
      { widgetBackgroundOpacity: 0.6, dashboardBackgroundOpacity: 0.2, uiScale: 1.0, settingsOpen: false }
    )
  })

  describe('initial state', () => {
    it('has correct default widgetBackgroundOpacity', () => {
      expect(useSettingsStore.getState().widgetBackgroundOpacity).toBe(0.6)
    })

    it('has correct default dashboardBackgroundOpacity', () => {
      expect(useSettingsStore.getState().dashboardBackgroundOpacity).toBe(0.2)
    })

    it('has correct default uiScale', () => {
      expect(useSettingsStore.getState().uiScale).toBe(1.0)
    })

    it('has settingsOpen false by default', () => {
      expect(useSettingsStore.getState().settingsOpen).toBe(false)
    })
  })

  describe('setWidgetBackgroundOpacity', () => {
    it('updates widgetBackgroundOpacity', () => {
      useSettingsStore.getState().setWidgetBackgroundOpacity(0.9)
      expect(useSettingsStore.getState().widgetBackgroundOpacity).toBe(0.9)
    })

    it('accepts 0', () => {
      useSettingsStore.getState().setWidgetBackgroundOpacity(0)
      expect(useSettingsStore.getState().widgetBackgroundOpacity).toBe(0)
    })

    it('accepts 1.0', () => {
      useSettingsStore.getState().setWidgetBackgroundOpacity(1.0)
      expect(useSettingsStore.getState().widgetBackgroundOpacity).toBe(1.0)
    })

    it('does not affect other state fields', () => {
      useSettingsStore.getState().setWidgetBackgroundOpacity(0.5)
      const state = useSettingsStore.getState()
      expect(state.dashboardBackgroundOpacity).toBe(0.2)
      expect(state.uiScale).toBe(1.0)
    })
  })

  describe('setDashboardBackgroundOpacity', () => {
    it('updates dashboardBackgroundOpacity', () => {
      useSettingsStore.getState().setDashboardBackgroundOpacity(0.8)
      expect(useSettingsStore.getState().dashboardBackgroundOpacity).toBe(0.8)
    })

    it('does not affect widgetBackgroundOpacity', () => {
      useSettingsStore.getState().setDashboardBackgroundOpacity(0.8)
      expect(useSettingsStore.getState().widgetBackgroundOpacity).toBe(0.6)
    })
  })

  describe('setUiScale', () => {
    it('updates uiScale', () => {
      useSettingsStore.getState().setUiScale(1.25)
      expect(useSettingsStore.getState().uiScale).toBe(1.25)
    })

    it('accepts minimum scale 0.75', () => {
      useSettingsStore.getState().setUiScale(0.75)
      expect(useSettingsStore.getState().uiScale).toBe(0.75)
    })

    it('accepts maximum scale 1.5', () => {
      useSettingsStore.getState().setUiScale(1.5)
      expect(useSettingsStore.getState().uiScale).toBe(1.5)
    })

    it('does not affect opacity fields', () => {
      useSettingsStore.getState().setUiScale(1.5)
      const state = useSettingsStore.getState()
      expect(state.widgetBackgroundOpacity).toBe(0.6)
      expect(state.dashboardBackgroundOpacity).toBe(0.2)
    })
  })

  describe('toggleSettings', () => {
    it('sets settingsOpen to true when false', () => {
      useSettingsStore.getState().toggleSettings()
      expect(useSettingsStore.getState().settingsOpen).toBe(true)
    })

    it('sets settingsOpen to false when true', () => {
      useSettingsStore.setState({ settingsOpen: true })
      useSettingsStore.getState().toggleSettings()
      expect(useSettingsStore.getState().settingsOpen).toBe(false)
    })

    it('can be toggled multiple times', () => {
      useSettingsStore.getState().toggleSettings() // false → true
      useSettingsStore.getState().toggleSettings() // true → false
      useSettingsStore.getState().toggleSettings() // false → true
      expect(useSettingsStore.getState().settingsOpen).toBe(true)
    })

    it('does not affect opacity or scale', () => {
      useSettingsStore.getState().toggleSettings()
      const state = useSettingsStore.getState()
      expect(state.widgetBackgroundOpacity).toBe(0.6)
      expect(state.dashboardBackgroundOpacity).toBe(0.2)
      expect(state.uiScale).toBe(1.0)
    })
  })
})
