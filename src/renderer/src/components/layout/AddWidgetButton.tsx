import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { widgetRegistry } from '@/widgets/registry'
import { useDashboardStore } from '@/stores/dashboard-store'

export function AddWidgetButton(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const addWidget = useDashboardStore((s) => s.addWidget)

  const availableWidgets = widgetRegistry.getAll()

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`absolute bottom-4 right-4 z-40 rounded-full bg-white/10 p-3 shadow-lg transition-all hover:bg-white/20 group-hover:opacity-100 ${open ? 'opacity-100' : 'opacity-0'}`}
        title="Add widget"
      >
        <Plus size={20} />
      </button>

      {/* Modal overlay */}
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
              <h2 className="text-lg font-medium">Add Widget</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {availableWidgets.map((w) => (
                <button
                  key={w.manifest.id}
                  onClick={() => {
                    addWidget(w.manifest.id)
                    setOpen(false)
                  }}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{w.manifest.name}</div>
                    <div className="text-xs text-white/50">{w.manifest.description}</div>
                  </div>
                  <Plus size={16} className="mt-0.5 text-white/40" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
