import type { MiniProgramDefinition } from '@/types/mini-program'
import { widgetRegistry } from '@/widgets/registry'
import { stockTrackerProgram } from './stock-tracker/manifest'

class MiniProgramRegistry {
  private programs = new Map<string, MiniProgramDefinition>()

  register(definition: MiniProgramDefinition): void {
    this.programs.set(definition.manifest.id, definition)

    // Auto-register any widgets this mini program provides
    for (const widget of definition.widgets) {
      widgetRegistry.register(widget)
    }
  }

  get(programId: string): MiniProgramDefinition | undefined {
    return this.programs.get(programId)
  }

  getAll(): MiniProgramDefinition[] {
    return Array.from(this.programs.values())
  }
}

export const miniProgramRegistry = new MiniProgramRegistry()

// Register built-in mini programs
miniProgramRegistry.register(stockTrackerProgram)
