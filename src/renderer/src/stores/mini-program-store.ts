import { create } from 'zustand'

interface MiniProgramState {
  /** ID of the currently active mini program, or null for dashboard view */
  activeProgramId: string | null
  /** Whether the mini programs launcher page is shown */
  showLauncher: boolean

  openLauncher: () => void
  closeLauncher: () => void
  openProgram: (programId: string) => void
  closeProgram: () => void
}

export const useMiniProgramStore = create<MiniProgramState>()((set) => ({
  activeProgramId: null,
  showLauncher: false,

  openLauncher: () => { set({ showLauncher: true, activeProgramId: null }) },
  closeLauncher: () => { set({ showLauncher: false }) },
  openProgram: (programId: string) => { set({ activeProgramId: programId, showLauncher: false }) },
  closeProgram: () => { set({ activeProgramId: null }) }
}))
