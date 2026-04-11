import { app, shell, screen, ipcMain, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { rmSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { registerIpcHandlers } from './ipc-handlers'
import { loadWindowBounds, saveWindowBounds } from './window-state'

// Clean-dev mode: wipe and redirect userData so the app starts with no persisted state.
// Triggered by NEXBOARD_CLEAN=1 (set via `npm run dev:clean`).
if (process.env.NEXBOARD_CLEAN === '1') {
  const cleanPath = join(app.getPath('temp'), 'nexboard-clean-dev')
  try { rmSync(cleanPath, { recursive: true, force: true }) } catch { /* ignore */ }
  app.setPath('userData', cleanPath)
  console.log('[clean-dev] userData wiped and redirected to', cleanPath)
}

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null

const WINDOW_WIDTH = 400
const WINDOW_MARGIN = 16

function getIconPath(): string {
  return is.dev
    ? join(__dirname, '../../resources/tray-icon.png')
    : join(process.resourcesPath, 'tray-icon.png')
}

function createWindow(): void {
  // Position in the top-right corner of the screen (used as default)
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize
  const defaultBounds = {
    x: screenWidth - WINDOW_WIDTH - WINDOW_MARGIN,
    y: WINDOW_MARGIN,
    width: WINDOW_WIDTH,
    height: screenHeight - WINDOW_MARGIN * 2
  }

  const bounds = loadWindowBounds(defaultBounds)

  mainWindow = new BrowserWindow({
    icon: nativeImage.createFromPath(getIconPath()),
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    frame: false,
    transparent: true,
    resizable: true,
    minimizable: true,
    maximizable: false,
    fullscreenable: true,
    minWidth: 320,
    minHeight: 400,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // Persist window bounds when the user moves or resizes the window
  const scheduleSave = (): void => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        saveWindowBounds(mainWindow.getBounds())
      }
    }, 500)
  }
  mainWindow.on('move', scheduleSave)
  mainWindow.on('resize', scheduleSave)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the renderer
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.webContents.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray(): void {
  const icon = nativeImage.createFromPath(getIconPath()).resize({ width: 32, height: 32 })
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: (): void => {
        if (!mainWindow) return
        if (mainWindow.isVisible()) {
          mainWindow.hide()
        } else {
          mainWindow.show()
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: (): void => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('NexBoard')

  tray.on('click', () => {
    if (!mainWindow) return
    if (mainWindow.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow.show()
    }
  })

  tray.on('right-click', () => {
    tray?.popUpContextMenu(contextMenu)
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.nexboard.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()
  createTray()

  ipcMain.on('window:reset-bounds', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
    const defaultBounds = { x: screenWidth - WINDOW_WIDTH - WINDOW_MARGIN, y: WINDOW_MARGIN, width: WINDOW_WIDTH, height: screenHeight - WINDOW_MARGIN * 2 }
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = null
    mainWindow.setBounds(defaultBounds)
    saveWindowBounds(defaultBounds)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

