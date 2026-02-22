import { useState } from 'react'
import { Grid3X3, X } from 'lucide-react'
import * as Icons from 'lucide-react'
import { miniProgramRegistry } from '@/mini-programs/registry'
import { useMiniProgramStore } from '@/stores/mini-program-store'

export function MiniProgramLauncher(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const openProgram = useMiniProgramStore((s) => s.openProgram)

  const programs = miniProgramRegistry.getAll()

  const handleOpen = (programId: string): void => {
    openProgram(programId)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        title="Mini Programs"
      >
        <Grid3X3 size={14} />
      </button>

      {open && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-white/10 bg-gray-900/95 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium">Mini Programs</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {programs.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/40">No mini programs installed</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {programs.map((program) => {
                  const IconComponent =
                    (Icons as Record<string, React.ComponentType<{ size?: number }>>)[
                      program.manifest.icon
                    ] || Icons.Box

                  return (
                    <button
                      key={program.manifest.id}
                      onClick={() => handleOpen(program.manifest.id)}
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
        </div>
      )}
    </>
  )
}
