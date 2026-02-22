import { create } from 'zustand'

interface MiniProgramState {
  /** ID of the currently active mini program, or null for dashboard view */
  activeProgramId: string | null

  openProgram: (programId: string) => void
  closeProgram: () => void
}

export const useMiniProgramStore = create<MiniProgramState>()((set) => ({
  activeProgramId: null,

  openProgram: (programId: string): void => {
    set({ activeProgramId: programId })
  },

  closeProgram: (): void => {
    set({ activeProgramId: null })
  }
}))
