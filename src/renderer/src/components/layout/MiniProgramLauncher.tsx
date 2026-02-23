import { Grid3X3 } from 'lucide-react'
import { useMiniProgramStore } from '@/stores/mini-program-store'

export function MiniProgramLauncher(): React.ReactElement {
  const openLauncher = useMiniProgramStore((s) => s.openLauncher)

  return (
    <button
      onClick={openLauncher}
      className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      title="Mini Programs"
    >
      <Grid3X3 size={15} />
    </button>
  )
}
