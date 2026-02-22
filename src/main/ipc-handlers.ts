import { ipcMain, BrowserWindow } from 'electron'
import { platform } from 'os'

export function registerIpcHandlers(): void {
  ipcMain.handle('platform:get', () => {
    return { platform: platform(), version: process.versions.electron }
  })

  ipcMain.on('window:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })

  ipcMain.on('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })
}
