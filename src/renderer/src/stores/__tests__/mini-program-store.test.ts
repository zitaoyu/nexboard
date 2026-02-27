import { describe, it, expect, beforeEach } from 'vitest'
import { useMiniProgramStore } from '../mini-program-store'

describe('mini-program-store', () => {
  beforeEach(() => {
    useMiniProgramStore.setState({ activeProgramId: null, showLauncher: false })
  })

  describe('initial state', () => {
    it('has no active program', () => {
      expect(useMiniProgramStore.getState().activeProgramId).toBeNull()
    })

    it('has showLauncher false', () => {
      expect(useMiniProgramStore.getState().showLauncher).toBe(false)
    })
  })

  describe('openLauncher', () => {
    it('sets showLauncher to true', () => {
      useMiniProgramStore.getState().openLauncher()
      expect(useMiniProgramStore.getState().showLauncher).toBe(true)
    })

    it('clears any active program', () => {
      useMiniProgramStore.setState({ activeProgramId: 'stock-tracker' })
      useMiniProgramStore.getState().openLauncher()
      expect(useMiniProgramStore.getState().activeProgramId).toBeNull()
    })
  })

  describe('closeLauncher', () => {
    it('sets showLauncher to false', () => {
      useMiniProgramStore.setState({ showLauncher: true })
      useMiniProgramStore.getState().closeLauncher()
      expect(useMiniProgramStore.getState().showLauncher).toBe(false)
    })

    it('does not touch activeProgramId', () => {
      useMiniProgramStore.setState({ showLauncher: true, activeProgramId: 'todo' })
      useMiniProgramStore.getState().closeLauncher()
      expect(useMiniProgramStore.getState().activeProgramId).toBe('todo')
    })
  })

  describe('openProgram', () => {
    it('sets activeProgramId', () => {
      useMiniProgramStore.getState().openProgram('stock-tracker')
      expect(useMiniProgramStore.getState().activeProgramId).toBe('stock-tracker')
    })

    it('closes the launcher', () => {
      useMiniProgramStore.setState({ showLauncher: true })
      useMiniProgramStore.getState().openProgram('todo')
      expect(useMiniProgramStore.getState().showLauncher).toBe(false)
    })

    it('switches from one program to another', () => {
      useMiniProgramStore.getState().openProgram('stock-tracker')
      useMiniProgramStore.getState().openProgram('todo')
      expect(useMiniProgramStore.getState().activeProgramId).toBe('todo')
    })
  })

  describe('closeProgram', () => {
    it('clears activeProgramId', () => {
      useMiniProgramStore.setState({ activeProgramId: 'stock-tracker' })
      useMiniProgramStore.getState().closeProgram()
      expect(useMiniProgramStore.getState().activeProgramId).toBeNull()
    })

    it('does not affect showLauncher', () => {
      useMiniProgramStore.setState({ activeProgramId: 'todo', showLauncher: true })
      useMiniProgramStore.getState().closeProgram()
      expect(useMiniProgramStore.getState().showLauncher).toBe(true)
    })

    it('is safe to call when no program is active', () => {
      expect(() => useMiniProgramStore.getState().closeProgram()).not.toThrow()
      expect(useMiniProgramStore.getState().activeProgramId).toBeNull()
    })
  })

  describe('launcher + program flow', () => {
    it('openProgram from launcher closes launcher and opens program', () => {
      useMiniProgramStore.getState().openLauncher()
      useMiniProgramStore.getState().openProgram('todo')
      const state = useMiniProgramStore.getState()
      expect(state.showLauncher).toBe(false)
      expect(state.activeProgramId).toBe('todo')
    })

    it('closeProgram returns to dashboard with no launcher shown', () => {
      useMiniProgramStore.getState().openProgram('todo')
      useMiniProgramStore.getState().closeProgram()
      const state = useMiniProgramStore.getState()
      expect(state.activeProgramId).toBeNull()
      expect(state.showLauncher).toBe(false)
    })
  })
})
