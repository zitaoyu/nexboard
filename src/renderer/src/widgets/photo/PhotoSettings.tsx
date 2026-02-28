import type { WidgetProps } from '@/types/widget'

function basename(filePath: string): string {
  return filePath.replace(/\\/g, '/').split('/').pop() ?? filePath
}

export function PhotoSettings({ config, onConfigChange }: WidgetProps): React.ReactElement {
  const photos = (config.photos as string[]) ?? []
  const rotation = (config.rotation as boolean) ?? false
  const interval = (config.interval as number) ?? 5

  const handleAddPhotos = async (): Promise<void> => {
    const picked = await window.api.pickPhotos()
    if (picked.length === 0) return
    const merged = Array.from(new Set([...photos, ...picked]))
    onConfigChange({ photos: merged })
  }

  const handleRemovePhoto = (index: number): void => {
    const updated = photos.filter((_, i) => i !== index)
    onConfigChange({ photos: updated })
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-3 text-sm text-white/80">
      {/* Photo list */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wide">Photos</span>
        {photos.length === 0 ? (
          <p className="text-xs text-white/30 italic">No photos added yet</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {photos.map((p, i) => (
              <li
                key={p}
                className="flex items-center gap-2 rounded bg-white/5 px-2 py-1"
              >
                <span className="min-w-0 flex-1 truncate text-xs text-white/70">
                  {basename(p)}
                </span>
                <button
                  onClick={() => handleRemovePhoto(i)}
                  className="shrink-0 rounded px-1.5 py-0.5 text-white/40 hover:bg-red-500/20 hover:text-red-400"
                  title="Remove"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleAddPhotos}
          className="mt-1 rounded bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
        >
          + Add Photos
        </button>
      </div>

      {/* Rotation toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wide">Rotation</span>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rotation}
            onChange={(e) => onConfigChange({ rotation: e.target.checked })}
            className="accent-white/70"
          />
          <span className="text-xs">Auto-rotate photos</span>
        </label>

        {rotation && (
          <label className="flex items-center gap-2">
            <span className="text-xs text-white/60">Interval</span>
            <input
              type="number"
              min={1}
              value={interval}
              onChange={(e) => onConfigChange({ interval: Math.max(1, Number(e.target.value)) })}
              className="w-16 rounded bg-white/10 px-2 py-1 text-xs text-white outline-none focus:bg-white/15"
            />
            <span className="text-xs text-white/60">sec</span>
          </label>
        )}
      </div>
    </div>
  )
}
