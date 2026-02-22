import { BrowserWindow } from 'electron'

/**
 * Enables "always on bottom" mode — the window stays behind all other
 * application windows but remains interactive and behaves like a normal app.
 *
 * Uses setAlwaysOnTop with a very low window level so the window renders
 * below all normal and floating windows. On blur, re-asserts the position
 * so newly focused windows always appear on top.
 */
export function enableDesktopMode(win: BrowserWindow): void {
  win.setAlwaysOnTop(true, 'normal', -100)

  const onBlur = (): void => {
    setTimeout(() => {
      if (!win.isDestroyed()) {
        win.setAlwaysOnTop(true, 'normal', -100)
      }
    }, 50)
  }

  win.on('blur', onBlur)
  ;(win as unknown as Record<string, unknown>).__desktopBlurHandler = onBlur
}

/**
 * Disables "always on bottom" mode and restores normal window behavior.
 */
export function disableDesktopMode(win: BrowserWindow): void {
  win.setAlwaysOnTop(false)

  const onBlur = (win as unknown as Record<string, unknown>).__desktopBlurHandler as
    | (() => void)
    | undefined
  if (onBlur) {
    win.removeListener('blur', onBlur)
    delete (win as unknown as Record<string, unknown>).__desktopBlurHandler
  }
}
