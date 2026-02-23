import { ipcMain, BrowserWindow, net } from 'electron'
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

  ipcMain.handle('http:get', async (_event, url: string) => {
    const request = net.fetch(url)
    const res = await request
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    return res.json()
  })
}
