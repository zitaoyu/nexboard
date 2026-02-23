import { BrowserWindow, app } from 'electron'
import { platform } from 'os'

import { attach as wallpaperAttach, detach as wallpaperDetach } from 'electron-as-wallpaper'

/**
 * Enables "always on bottom" mode — the window stays behind all other
 * application windows but remains interactive.
 *
 * On Windows: uses electron-as-wallpaper to attach at the desktop/wallpaper
 * level, which is natively below every application window.
 * On macOS: uses setAlwaysOnTop with a very low window level and re-asserts
 * on blur so newly focused windows always appear on top.
 */
export function enableDesktopMode(win: BrowserWindow): void {
  if (platform() === 'win32') {
    wallpaperAttach(win, {
      transparent: true,
      forwardMouseInput: true,
      forwardKeyboardInput: true
    })

    // Notify renderer
    if (!win.isDestroyed()) {
      win.webContents.send('desktop-mode:changed', true)
    }
    return
  }

  // macOS fallback
  win.setAlwaysOnTop(true, 'normal', -1)

  const onBlur = (): void => {
    setTimeout(() => {
      if (!win.isDestroyed()) {
        win.setAlwaysOnTop(true, 'normal', -1)
      }
    }, 50)
  }

  win.on('blur', onBlur)
  ;(win as unknown as Record<string, unknown>).__desktopBlurHandler = onBlur

  if (!win.isDestroyed()) {
    win.webContents.send('desktop-mode:changed', true)
  }
}

/**
 * Disables "always on bottom" mode and restores normal window behavior.
 */
export function disableDesktopMode(win: BrowserWindow): void {
  if (platform() === 'win32') {
    wallpaperDetach(win)

    if (!win.isDestroyed()) {
      win.webContents.send('desktop-mode:changed', false)
    }
    return
  }

  // macOS fallback
  win.setAlwaysOnTop(false)

  const onBlur = (win as unknown as Record<string, unknown>).__desktopBlurHandler as
    | (() => void)
    | undefined
  if (onBlur) {
    win.removeListener('blur', onBlur)
    delete (win as unknown as Record<string, unknown>).__desktopBlurHandler
  }

  if (!win.isDestroyed()) {
    win.webContents.send('desktop-mode:changed', false)
  }
}

// Ensure the window is detached cleanly when the app quits
app.on('before-quit', () => {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (platform() === 'win32') {
      try {
        wallpaperDetach(win)
      } catch {
        // ignore if already detached
      }
    }
  })
})
