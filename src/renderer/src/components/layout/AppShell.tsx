import { useMiniProgramStore } from '@/stores/mini-program-store'
import { useSettingsStore } from '@/stores/settings-store'
import { miniProgramRegistry } from '@/mini-programs/registry'
import { DashboardGrid } from './DashboardGrid'
import { MiniProgramLauncher } from './MiniProgramLauncher'
import { MiniProgramsPage } from './MiniProgramsPage'
import { SettingsPanel } from '../settings/SettingsPanel'
import { ArrowLeft, Settings, Minus, X } from 'lucide-react'

export function AppShell(): React.ReactElement {
  const activeProgramId = useMiniProgramStore((s) => s.activeProgramId)
  const closeProgram = useMiniProgramStore((s) => s.closeProgram)
  const showLauncher = useMiniProgramStore((s) => s.showLauncher)
  const closeLauncher = useMiniProgramStore((s) => s.closeLauncher)
  const toggleSettings = useSettingsStore((s) => s.toggleSettings)
  const settingsOpen = useSettingsStore((s) => s.settingsOpen)
  const dashboardOpacity = useSettingsStore((s) => s.dashboardOpacity)

  const activeProgram = activeProgramId ? miniProgramRegistry.get(activeProgramId) : null
  const isSubView = showLauncher || !!activeProgram

  const handleBack = (): void => {
    if (activeProgram) closeProgram()
    else closeLauncher()
  }

  const handleMinimize = (): void => {
    window.electron?.ipcRenderer.send('window:minimize')
  }

  const handleClose = (): void => {
    window.electron?.ipcRenderer.send('window:close')
  }

  const titleLabel = activeProgram
    ? activeProgram.manifest.name
    : showLauncher
      ? 'Mini Programs'
      : 'NexBoard'

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10">
      {/* Background layer — opacity-controlled independently of content */}
      <div
        className="absolute inset-0 rounded-xl bg-gray-900/95 backdrop-blur-md"
        style={{ opacity: dashboardOpacity }}
      />

      {/* All content sits above the background at full opacity */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
      {/* Title bar — draggable region + window controls */}
      <div
        className="flex shrink-0 items-center justify-between px-3 py-2"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          {isSubView ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1.5 text-xs transition-colors hover:bg-white/20"
              title="Back to dashboard"
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
              <ArrowLeft size={13} />
              Back
            </button>
          ) : (
            <span className="text-xs font-medium text-white/60">{titleLabel}</span>
          )}
          {isSubView && (
            <span className="text-xs font-medium text-white/60">{titleLabel}</span>
          )}
        </div>

        <div
          className="flex items-center gap-1"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <MiniProgramLauncher />
          <button
            onClick={toggleSettings}
            className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            title="Settings"
          >
            <Settings size={15} />
          </button>
          <button
            onClick={handleMinimize}
            className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            title="Minimize"
          >
            <Minus size={15} />
          </button>
          <button
            onClick={handleClose}
            className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="min-h-0 flex-1 overflow-auto">
        {activeProgram ? (
          <div className="h-full w-full p-3">
            <activeProgram.AppComponent />
          </div>
        ) : showLauncher ? (
          <MiniProgramsPage />
        ) : (
          <DashboardGrid />
        )}
      </div>

        {/* Settings panel overlay */}
        {settingsOpen && <SettingsPanel />}
      </div>
    </div>
  )
}
