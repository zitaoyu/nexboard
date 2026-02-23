import * as Icons from 'lucide-react'
import { miniProgramRegistry } from '@/mini-programs/registry'
import { useMiniProgramStore } from '@/stores/mini-program-store'

export function MiniProgramsPage(): React.ReactElement {
  const openProgram = useMiniProgramStore((s) => s.openProgram)

  const programs = miniProgramRegistry.getAll()

  return (
    <div className="h-full w-full overflow-auto p-4">
      {programs.length === 0 ? (
        <p className="mt-8 text-center text-sm text-white/40">No mini programs installed</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {programs.map((program) => {
            const IconComponent =
              (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[
                program.manifest.icon
              ] || Icons.Box

            return (
              <button
                key={program.manifest.id}
                onClick={() => openProgram(program.manifest.id)}
                className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-white/10"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: program.manifest.color + '33' }}
                >
                  <IconComponent size={28} />
                </div>
                <span className="text-xs">{program.manifest.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
