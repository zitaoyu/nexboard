import { useState, useEffect } from 'react'
import type { WidgetProps } from '@/types/widget'

export function PhotoWidget({ config }: WidgetProps): React.ReactElement {
  const photos = (config.photos as string[]) ?? []
  const rotation = (config.rotation as boolean) ?? false
  const interval = (config.interval as number) ?? 5

  const [currentIndex, setCurrentIndex] = useState(0)
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  // Rotate through photos on an interval
  useEffect(() => {
    if (!rotation || photos.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % photos.length)
    }, interval * 1000)
    return () => clearInterval(timer)
  }, [rotation, interval, photos.length])

  // Reset index when photo list shrinks past current position
  useEffect(() => {
    if (currentIndex >= photos.length && photos.length > 0) {
      setCurrentIndex(0)
    }
  }, [photos.length, currentIndex])

  // Load the current photo as a data URL
  useEffect(() => {
    if (photos.length === 0) {
      setDataUrl(null)
      return
    }
    const path = photos[currentIndex % photos.length]
    let cancelled = false
    window.api.readFileAsDataUrl(path).then((url) => {
      if (!cancelled) setDataUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [currentIndex, photos])

  if (photos.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/40">
        <span className="text-sm">No photos selected</span>
        <span className="text-xs">Open settings to add photos</span>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {dataUrl ? (
        <img
          src={dataUrl}
          className="h-full w-full object-cover"
          alt="Photo widget"
          draggable={false}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      )}
    </div>
  )
}
