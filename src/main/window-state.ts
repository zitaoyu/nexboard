import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface WindowBounds {
  x: number
  y: number
  width: number
  height: number
}

function getStatePath(): string {
  return join(app.getPath('userData'), 'window-state.json')
}

export function loadWindowBounds(defaults: WindowBounds): WindowBounds {
  try {
    const path = getStatePath()
    if (existsSync(path)) {
      const data = JSON.parse(readFileSync(path, 'utf-8')) as Partial<WindowBounds>
      if (
        typeof data.x === 'number' &&
        typeof data.y === 'number' &&
        typeof data.width === 'number' &&
        typeof data.height === 'number'
      ) {
        return data as WindowBounds
      }
    }
  } catch {
    // fall through to defaults
  }
  return defaults
}

export function saveWindowBounds(bounds: WindowBounds): void {
  try {
    writeFileSync(getStatePath(), JSON.stringify(bounds), 'utf-8')
  } catch {
    // ignore write errors
  }
}
